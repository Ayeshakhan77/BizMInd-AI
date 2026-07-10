"""
BizMind AI — AI Service Module
Handles integration with Fireworks AI (OpenAI-compatible API).
"""

import os
import json
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

# Initialize the client
client = None
API_KEY = os.getenv("FIREWORKS_API_KEY", "")
BASE_URL = "https://api.fireworks.ai/inference/v1"
MODEL = "accounts/fireworks/models/llama-v3p1-8b-instruct"

if API_KEY:
    client = OpenAI(
        api_key=API_KEY,
        base_url=BASE_URL,
    )


def _call_ai(system_prompt: str, user_prompt: str, max_tokens: int = 2000) -> str:
    """Call the AI API with error handling."""
    if not client:
        return ""
    
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=max_tokens,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        print(f"AI API Error: {e}")
        return ""


def generate_recommendations(analysis_results: dict, user_answers: dict) -> list:
    """Generate AI-powered business recommendations."""
    
    system_prompt = """You are BizMind AI, a world-class business consultant for small and medium businesses globally.
You provide actionable, data-driven recommendations. Be specific and practical.
Always respond with valid JSON — an array of recommendation objects.
Each object must have: "icon" (emoji), "title" (string), "description" (2-3 sentences), "category" (string).
Return exactly 6 recommendations covering: sales trends, best products, worst products, stock prediction, marketing suggestion, profit improvement."""

    user_prompt = f"""Based on this business data analysis:

Analysis Results:
{json.dumps(analysis_results, indent=2, default=str)}

Business Owner's Preferences:
{json.dumps(user_answers, indent=2)}

Generate 6 specific, actionable recommendations. Return ONLY valid JSON array."""

    response = _call_ai(system_prompt, user_prompt)
    
    # Try to parse AI response
    if response:
        try:
            # Try to extract JSON from response
            start = response.find('[')
            end = response.rfind(']') + 1
            if start != -1 and end > start:
                return json.loads(response[start:end])
        except json.JSONDecodeError:
            pass
    
    # Fallback recommendations
    return _get_fallback_recommendations(analysis_results)


def _get_fallback_recommendations(analysis: dict) -> list:
    """Generate fallback recommendations when AI is unavailable."""
    recommendations = []
    
    sales = analysis.get("sales_analysis", {})
    top = analysis.get("top_performers", [])
    worst = analysis.get("worst_performers", [])
    trends = analysis.get("trends", {})
    anomalies = analysis.get("anomalies", [])
    
    # Trend analysis
    trend_dir = trends.get("direction", "stable") if trends else "stable"
    pct = trends.get("percent_change", 0) if trends else 0
    recommendations.append({
        "icon": "📈" if trend_dir == "increasing" else "📉",
        "title": f"Sales Trend: {trend_dir.title()}",
        "description": f"Your sales are {trend_dir} with a {abs(pct):.1f}% change over the analyzed period. "
                       f"{'Keep up the momentum by doubling down on your best channels.' if trend_dir == 'increasing' else 'Consider reviewing your pricing strategy and marketing efforts to reverse this trend.'}",
        "category": "Sales Trends"
    })
    
    # Best products
    if top and len(top) >= 3:
        top_names = ", ".join([p["name"] for p in top[:3]])
        recommendations.append({
            "icon": "⭐",
            "title": "Top 3 Best Sellers",
            "description": f"Your best performing products are: {top_names}. "
                           f"Consider increasing stock for these items and featuring them prominently in your marketing.",
            "category": "Best Products"
        })
    else:
        recommendations.append({
            "icon": "⭐",
            "title": "Best Sellers Identified",
            "description": "We've identified your top performing products. Focus your marketing and inventory efforts on these winners to maximize revenue.",
            "category": "Best Products"
        })
    
    # Worst products
    if worst and len(worst) >= 3:
        worst_names = ", ".join([p["name"] for p in worst[:3]])
        recommendations.append({
            "icon": "⚠️",
            "title": "Bottom 3 Performers",
            "description": f"These products need attention: {worst_names}. "
                           f"Consider discounting them to clear inventory, reducing future orders, or bundling them with popular items.",
            "category": "Worst Products"
        })
    else:
        recommendations.append({
            "icon": "⚠️",
            "title": "Underperforming Products",
            "description": "Some products are significantly underperforming. Consider reviewing pricing, placement, or discontinuing slow-moving items to free up capital.",
            "category": "Worst Products"
        })
    
    # Stock prediction
    avg_sale = sales.get("average_sale", 0) if sales else 0
    recommendations.append({
        "icon": "📦",
        "title": "Stock Prediction",
        "description": f"Based on your average transaction value of ${avg_sale:.2f}, we recommend maintaining at least 2 weeks of safety stock for your top sellers. "
                       f"Reorder points should be set at 30% above your average weekly sales volume.",
        "category": "Stock Management"
    })
    
    # Marketing
    recommendations.append({
        "icon": "📣",
        "title": "Marketing Suggestion",
        "description": "Focus your marketing budget on your top 3 products — they drive the most revenue. "
                       "Consider creating bundles pairing best-sellers with slower items to increase overall basket size.",
        "category": "Marketing"
    })
    
    # Profit improvement
    total = sales.get("total_sales", 0) if sales else 0
    recommendations.append({
        "icon": "💰",
        "title": "Profit Improvement",
        "description": f"With total revenue of ${total:,.2f}, focus on reducing costs for your bottom performers while increasing prices slightly on your best sellers. "
                       f"Even a 5% margin improvement across your top products could significantly boost profits.",
        "category": "Profit"
    })
    
    return recommendations


def chat_response(message: str, analysis_context: dict, chat_history: list = None) -> str:
    """Generate a chat response with business data context."""
    
    system_prompt = """You are BizMind AI, a friendly and knowledgeable business consultant chatbot.
You help small and medium business owners understand their data and make better decisions.
You can respond in English, Urdu, or any language the user writes in.
Keep responses concise (2-4 sentences) and actionable.
Use the provided business data context to give specific answers.
If you don't have enough data to answer, say so honestly and suggest what data might help."""

    context_str = json.dumps(analysis_context, indent=2, default=str) if analysis_context else "No data uploaded yet."
    
    history_str = ""
    if chat_history:
        for msg in chat_history[-5:]:  # Last 5 messages for context
            role = msg.get("role", "user")
            content = msg.get("content", "")
            history_str += f"{role}: {content}\n"

    user_prompt = f"""Business Data Context:
{context_str}

Recent Chat History:
{history_str}

User's Question: {message}

Respond helpfully based on the business data. If the user writes in Urdu or another language, respond in the same language."""

    response = _call_ai(system_prompt, user_prompt, max_tokens=500)
    
    if not response:
        # Fallback response
        return _get_fallback_chat_response(message, analysis_context)
    
    return response


def _get_fallback_chat_response(message: str, context: dict) -> str:
    """Generate a fallback chat response when AI is unavailable."""
    msg_lower = message.lower()
    
    sales = context.get("sales_analysis", {}) if context else {}
    top = context.get("top_performers", []) if context else []
    
    if any(word in msg_lower for word in ["best", "top", "popular", "best selling"]):
        if top:
            names = ", ".join([p["name"] for p in top[:3]])
            return f"Your top performing products are: {names}. These generate the most revenue for your business!"
        return "Upload your sales data so I can identify your best performing products."
    
    if any(word in msg_lower for word in ["sale", "revenue", "income", "profit"]):
        if sales:
            return f"Your total sales are ${sales.get('total_sales', 0):,.2f} with an average of ${sales.get('average_sale', 0):,.2f} per transaction."
        return "I'd be happy to analyze your sales! Please upload your data file first."
    
    if any(word in msg_lower for word in ["stock", "inventory", "order"]):
        return "Based on your data, I recommend maintaining 2 weeks of safety stock for your best sellers. Would you like specific reorder suggestions?"
    
    if any(word in msg_lower for word in ["kya", "hai", "meri", "kaisa", "khatam"]):
        if sales:
            return f"Aapka total sales ${sales.get('total_sales', 0):,.2f} hai. Aapka business analysis ready hai — dashboard pe detail dekh sakte hain!"
        return "Pehle apna data file upload karein, phir main aapke business ka analysis karoon ga!"
    
    return "I'm here to help with your business data! Try asking about your sales, top products, stock levels, or any business metrics. Upload data first for personalized insights."
