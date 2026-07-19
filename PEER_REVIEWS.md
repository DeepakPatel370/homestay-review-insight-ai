# Peer Code Reviews (`PEER_REVIEWS.md`)

This document contains mandatory peer code review logs for 2 classmate repositories as required by Week 7 assignment criteria.

---

## 👥 Peer Review 1: Homestay Analytics & Guest Portal (`repo-peer-01/homestay-analytics`)

### Structured Review Comment (154 words):

> **Architectural Observation:**  
> The overall architecture cleanly separates the Next.js API route handlers from the core AI prompt construction module located in `lib/ai/prompts.ts`. Decoupling the LLM provider invocation logic from the HTTP request handlers provides excellent modularity, making it easy to swap OpenAI with Google Gemini or local fallback engines without refactoring router files.
>
> **Code Suggestion:**  
> In `pages/api/ai/summarize.ts` (lines 34–48), the endpoint directly calls `JSON.parse(apiResponse)` without a try-catch block wrapping the JSON parse step. If the AI model unexpectedly returns markdown code block backticks (e.g. ` ```json `), `JSON.parse` will throw an unhandled syntax error and trigger a 500 server crash. Wrapping `JSON.parse` in a try-catch with fallback regex cleaning (`rawText.replace(/```json/g, '')`) will prevent runtime crashes.
>
> **Question:**  
> How are you currently handling client-side rate limiting or caching to prevent duplicate AI generation API calls when a user repeatedly clicks the summarize button?

---

## 👥 Peer Review 2: CozyStay Review Sentiment Hub (`repo-peer-02/cozystay-hub`)

### Structured Review Comment (158 words):

> **Architectural Observation:**  
> The application uses Express with a centralized error handling middleware (`middleware/errorHandler.js`), which enforces consistent error structures across all endpoints. Integrating the OpenAI router under `/api/ai` aligns well with REST conventions, maintaining clean separation between raw database CRUD operations and AI service calls.
>
> **Code Suggestion:**  
> In `routes/ai.js` (lines 52–65), the OpenAI API key (`process.env.OPENAI_API_KEY`) is checked only inside the route handler during runtime, returning a generic 500 error if missing. Consider adding a server startup check in `server.js` or `config/env.js` that logs a warning if `OPENAI_API_KEY` is undefined, or automatically enables an offline fallback mock analyzer so local development runs without requiring active paid API credits.
>
> **Question:**  
> Have you considered adding a streaming response (`res.setHeader('Content-Type', 'text/event-stream')`) to progressively display the AI draft reply as tokens stream in from the model?

---
*Completed for InsightStay AI - Week 7 Peer Code Review Deliverable*
