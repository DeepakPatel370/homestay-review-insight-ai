# AI Prompt Engineering Log (`PROMPTS.md`)

This log documents the iterative prompt engineering process for the **InsightStay AI** homestay review sentiment analysis, theme extraction, and draft response generation feature.

---

## 🤖 System Role & Persona Definition

Across all prompt variations, the model is assigned the following system persona:

> **System Role / Persona:**  
> *"You are an expert AI Hospitality Assistant and Guest Relations Director for homestay and vacation rental properties. Your task is to objectively analyze guest reviews (detecting true sentiment, scoring overall satisfaction on a 0–100 scale, and extracting key operational theme tags) while composing warm, professional, and personalized host reply drafts customized to the requested tone."*

---

## 🧪 Prompt Variations Tested

### Variation 1: Direct Text Prompt (Unstructured Output)

#### Prompt Template:
```text
You are a hospitality assistant. Read this review for property "{propertyName}":
"{text}"

Tell me:
1. Is it positive, mixed, or negative?
2. Give a score from 0 to 100.
3. List main themes.
4. Write a {tone} host reply.
```

#### Example Input:
- **Property:** Sunset Haven Villa
- **Review Text:** *"The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside."*
- **Tone:** Professional

#### Example Output:
```text
1. Sentiment: Mixed
2. Score: 65/100
3. Themes: Cleanliness, Pool, Check-in Delay, Villa Layout
4. Host Reply: Hi Guest, thank you for staying at Sunset Haven Villa. We are glad you enjoyed the pool and layout! We apologize for the check-in delay and outdated instructions. We have updated our check-in guide. Hope to see you again!
```

* **Outcome & Limitations:** While fast and straightforward, the plain text formatting was inconsistent to parse programmatically in the backend Express router. Sentiments and scores required regex parsing, which occasionally broke on edge cases.

---

### Variation 2: Few-Shot JSON Schema Prompt

#### Prompt Template:
```text
Analyze the homestay review below and return a JSON object matching this schema:
{
  "sentiment": "positive" | "mixed" | "negative",
  "score": integer (0-100),
  "themes": string[],
  "summary": string,
  "reply": string
}

Example Input: "Great stay, delicious breakfast, but noisy street."
Example Output: {"sentiment": "mixed", "score": 70, "themes": ["Breakfast", "Noise"], "summary": "Guest loved breakfast but noted street noise.", "reply": "Dear Guest, thank you for your feedback..."}

Property: "{propertyName}"
Review: "{text}"
Tone: "{tone}"
```

#### Example Input:
- **Property:** Sunset Haven Villa
- **Review Text:** *"Worst experience ever. The sheets were dirty, the air conditioning was leaking, and the host refused to refund us. Avoid!"*
- **Tone:** Empathetic

#### Example Output:
```json
{
  "sentiment": "negative",
  "score": 15,
  "themes": ["Cleanliness", "AC Issue", "Refund Dispute"],
  "summary": "The guest had a negative experience due to dirty sheets, a leaking AC, and refund disputes.",
  "reply": "Dear Guest,\n\nWe are deeply saddened to hear about your experience at Sunset Haven Villa. Your comfort is our highest priority, and we apologize sincerely for failing to meet standards regarding cleanliness, ac issue, refund dispute. We are taking immediate corrective actions. Please allow us the opportunity to make this right by contacting us directly.\n\nHeartfelt regards,\nGuest Relations Team"
}
```

* **Outcome & Limitations:** Structured JSON output made backend parsing clean. However, without strict tone enforcement guidelines, the generated response drafts occasionally felt generic and repeated raw theme strings verbatim.

---

### Variation 3: Persona-Driven Contextual Prompt with Explicit Tone Rules (Chosen & Best Performing)

#### Prompt Template:
```text
System Role: You are an AI Hospitality Assistant for homestay properties.
Analyze the following guest review for property "{propertyName}".

Review Text:
"""
{text}
"""

Requested Response Tone: {tone} (Options: Professional, Empathetic, Enthusiastic, De-escalating)

Guidelines:
1. Objectively evaluate sentiment ("positive", "mixed", or "negative") based on guest emotion and issue severity.
2. Assign a numerical score from 0 to 100 representing overall guest satisfaction.
3. Extract 2 to 5 specific operational themes (e.g., "Cleanliness", "Check-in Delay", "Host Hospitality", "Property Amenities").
4. Write a 1-2 sentence executive summary of the review.
5. Draft a complete, highly engaging host response matching the requested {tone} tone. Emphasize gratitude for positive points, address specific negative feedback constructively, and outline actionable improvements without making unfulfilled promises.

Return ONLY a valid JSON object matching this schema EXACTLY without markdown formatting:
{
  "sentiment": "positive" | "mixed" | "negative",
  "score": number,
  "themes": [string],
  "summary": string,
  "reply": string
}
```

#### Example Input:
- **Property:** Sunset Haven Villa
- **Review Text:** *"We had the most wonderful stay! The host left us fresh cookies, the house was immaculate, and the beds were so comfy. 10/10 will come back!"*
- **Tone:** Enthusiastic

#### Example Output:
```json
{
  "sentiment": "positive",
  "score": 98,
  "themes": ["Host Hospitality", "Cleanliness", "Comfort & Bedding"],
  "summary": "The guest expressed high satisfaction with their stay at Sunset Haven Villa, highlighting pleasant fresh cookies, immaculate cleanliness, and comfy beds.",
  "reply": "Hi Guest!\n\nWOW! Thank you so much for the fantastic 5-star review of Sunset Haven Villa! 🎉 We are absolutely thrilled to hear how much you loved the fresh cookies, pristine home, and cozy beds! Providing an immaculate stay and warm hospitality is what we strive for every single day. We can't wait to host your next amazing getaway!\n\nCheers & Sunshine,\nSunset Haven Villa Team"
}
```

---

## 🏆 Comparative Evaluation & Best Prompt Selection

### Which prompt worked best and why?
**Variation 3 (Persona-Driven Contextual Prompt with Explicit Tone Rules)** worked best for our AI feature. By explicitly combining a system persona with schema enforcement (`responseMimeType: "application/json"`) and detailed tone guidelines, Variation 3 consistently generated high-quality, non-repetitive host responses that adapt naturally whether the host requests an *Enthusiastic*, *Empathetic*, or *De-escalating* tone. Furthermore, restricting the format strictly to valid JSON eliminated parsing errors in the backend service, ensuring seamless end-to-end reliability for our frontend UI.

---
*Generated for InsightStay AI - Week 7 AI Feature Integration Deliverable*
