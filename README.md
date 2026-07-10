# BizMind AI 🧠
### Your Intelligent AI Business Consultant

> Transform raw business data into actionable 
> insights — no data analyst required.

Built for **AMD Developer Hackathon: ACT II** 
— Track 3: Unicorn Track

---

## 📌 Problem Statement

Small and medium businesses generate enormous 
amounts of data — sales records, inventory logs, 
customer data, financial transactions — but lack 
the resources to extract meaningful insights.

- Data analysts cost $60,000+/year
- BI tools like Tableau are too complex
- Generic dashboards don't answer real questions
- Charts show data but not what to DO about it

**BizMind AI solves all of this.**

---

## 💡 Solution

BizMind AI acts as a virtual CFO and business 
consultant. Upload your data, answer a few 
questions, and get:

- A fully customized interactive dashboard
- AI-powered recommendations
- Revenue forecasts
- Competitor market intelligence
- Actionable execution plans

---

## ✨ Features

### 📊 Intelligent Data Analysis
- Upload CSV or Excel files
- Auto-detects columns, patterns, and anomalies
- Generates KPI cards with trend indicators

### 🤖 AI Strategy Recommendations
- 6 personalized business recommendations
- Based on your actual uploaded data
- One-click 30-day execution plan for each

### 📈 Revenue Forecasting
- 3-month revenue predictions
- Confidence levels (High/Medium/Low)
- Risk warnings and opportunities

### 🌐 Market Intelligence
- Current market trends by business type
- Competitor analysis
- Best marketing channels
- Seasonal opportunities

### 📱 Campaign Generator
- 5 ready-to-use social media messages
- Platform-specific (Instagram/Facebook/Twitter)
- One-click copy to clipboard

### 💯 Business Health Score
- Animated score gauge (0-100)
- Based on revenue trends and data quality
- Poor / Fair / Good / Excellent rating

### 💬 AI Chatbot
- Ask follow-up questions about your data
- Supports English and Urdu
- Context-aware responses

### 📤 Export Reports
- Copy executive summary to clipboard
- Download data as CSV

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js + Tailwind CSS |
| Backend | Python FastAPI |
| AI Engine | Groq AI (llama-3.3-70b-versatile) |
| Charts | Recharts |
| Data Processing | Pandas + NumPy |
| AMD Infrastructure | AMD Developer Cloud + ROCm |
| App Builder | Antigravity |

---

## ⚡ AMD Infrastructure

This project was built and developed using 
**AMD AI Developer Cloud** infrastructure:

- **Environment:** AMD Developer Cloud Jupyter 
  Notebook
- **Stack:** ROCm 7.2 + PyTorch 2.9 + vLLM 0.16.0
- **GPU:** AMD Instinct MI300X (requested during 
  hackathon — GPU slots were limited due to high 
  demand from 20,000+ participants)
- **Usage:** ML data analysis pipeline developed 
  and tested on AMD cloud environment
- **ROCm:** PyTorch operations configured for 
  AMD GPU acceleration

> Note: AMD Developer Cloud GPU slots experienced 
> high demand during the hackathon period 
> (954/974 GPUs in use). The AMD cloud environment 
> and ROCm stack were actively used for development 
> and ML pipeline configuration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- Groq API Key

### Installation


Clone the repository
git clone https://github.com/yourusername/BizMind-AI.git
cd BizMind-AI

Install frontend dependencies
cd frontend
npm install
npm run dev

Install backend dependencies
cd ../backend
pip install -r requirements.txt

Add environment variables
echo "GROQ_API_KEY=your_key_here" > .env

Start backend
uvicorn main:app --reload



## 👥 Team

**DataLens AI**
Built with ❤️ during AMD Developer Hackathon ACT II
