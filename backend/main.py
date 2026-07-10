"""
BizMind AI — FastAPI Backend
Proxy server using Groq's OpenAI-compatible Chat Completions API (model: llama-3.3-70b-versatile)
for business recommendations and chat context.
"""


import os
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import httpx
from dotenv import load_dotenv
from .file_parser import process_file_data

load_dotenv()

app = FastAPI(title="BizMind AI Backend Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Groq API configuration (OpenAI-compatible)
# Provide your key via env var: GROQ_API_KEY
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "your_groq_api_key_here")
GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
MODEL = "llama-3.3-70b-versatile"


class RecommendationPayload(BaseModel):
    data_summary: dict
    answers: dict

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatPayload(BaseModel):
    message: str
    history: List[ChatMessage]
    data_summary: dict

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """Parse CSV or Excel file on the backend and return stats + charts data."""
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    if ext not in ("csv", "xlsx", "xls"):
        raise HTTPException(400, "Only CSV and Excel (.xlsx, .xls) files are supported.")

    content = await file.read()
    if not content:
        raise HTTPException(400, "The uploaded file is empty.")

    try:
        results = process_file_data(content, ext)
        return {
            "filename": filename,
            "total_rows": results["total_rows"],
            "columns": results["columns"],
            "numeric_fields": results["numeric_fields"],
            "sums": results["sums"],
            "averages": results["averages"],
            "preview": results["preview"],
            "all_rows": results["all_rows"]
        }
    except Exception as e:
        raise HTTPException(400, f"Failed to parse file: {str(e)}")

@app.post("/recommendations")
async def get_ai_recommendations(payload: RecommendationPayload):
    """Call Groq Chat Completions API to generate structured recommendations."""

    prompt = f"""You are an expert business consultant for small and medium sized shops. 
The user has uploaded their business data with these stats: {payload.data_summary}.
They have these preferences:
- Focus: {payload.answers.get('focus_area', 'General')}
- Period: {payload.answers.get('time_period', 'All Time')}
- Goal: {payload.answers.get('business_goal', 'Increase Sales')}

Give exactly 6 recommendations in this EXACT JSON format:
{{
  "recommendations": [
    {{
      "title": "string",
      "description": "string (2-3 sentences, specific)",
      "action": "string (one clear action to take)",
      "impact": "High" | "Medium" | "Low",
      "icon": "emoji"
    }}
  ]
}}"""

    async with httpx.AsyncClient() as client:
        try:
            if not GROQ_API_KEY:
                raise HTTPException(500, "Missing GROQ_API_KEY environment variable")

            response = await client.post(
                GROQ_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "max_tokens": 1024,
                },
                timeout=60.0,
            )

            if response.status_code != 200:
                raise HTTPException(response.status_code, response.text)

            data = response.json()
            content = data["choices"][0]["message"]["content"]
            return {"raw_response": content}

        except Exception as e:
            raise HTTPException(500, f"Groq request failed: {str(e)}")


@app.post("/chat")
async def chat_with_ai(payload: ChatPayload):
    """Chat with business data context through Groq proxy."""

    system_prompt = f"""You are BizMind AI, a business consultant.
The user's business data summary is: {payload.data_summary}.
Answer questions specifically about their data. Support both English and Urdu. 
Be specific with numbers from their data. 
If no data is available, offer general business advice."""

    # Construct single conversational context text for Groq
    conversation = system_prompt + "\n\nConversation History:\n"
    for msg in payload.history:
        role = "User" if msg.role == "user" else "Assistant"
        conversation += f"{role}: {msg.content}\n"
    conversation += f"User: {payload.message}\nAssistant:"

    async with httpx.AsyncClient() as client:
        try:
            if not GROQ_API_KEY:
                raise HTTPException(500, "Missing GROQ_API_KEY environment variable")

            response = await client.post(
                GROQ_URL,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                },
                json={
                    "model": MODEL,
                    "messages": [
                        {"role": "user", "content": conversation}
                    ],
                    "max_tokens": 500,
                },
                timeout=60.0,
            )

            if response.status_code != 200:
                raise HTTPException(response.status_code, response.text)

            data = response.json()
            reply = data["choices"][0]["message"]["content"]
            return {"reply": reply}

        except Exception as e:
            raise HTTPException(500, f"Groq chat failed: {str(e)}")


@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
