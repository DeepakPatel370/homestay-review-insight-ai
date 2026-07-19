import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware
router.use(requireAuth);

/**
 * Helper: Intelligent Fallback Analyzer
 * Used when no external API key is provided or when external AI services are unavailable/timed out.
 */
const generateLocalAnalysis = (propertyName, text, tone = 'Professional') => {
  const lowercaseText = text.toLowerCase();
  
  let sentiment = 'positive';
  let score = 88;
  let themes = [];

  const positiveWords = ['great', 'excellent', 'wonderful', 'perfect', 'clean', 'comfy', 'cozy', 'amazing', 'love', 'nice', 'delicious', 'immaculate', 'stunning', 'friendly', 'peaceful'];
  const negativeWords = ['worst', 'dirty', 'leak', 'broken', 'smell', 'noise', 'rude', 'bad', 'slow', 'unresponsive', 'refund', 'avoid', 'poor', 'delayed', 'wait'];
  const mixedWords = ['but', 'however', 'although', 'only issue', 'except', 'yet', 'issue was', 'despite'];

  let positiveCount = positiveWords.filter(w => lowercaseText.includes(w)).length;
  let negativeCount = negativeWords.filter(w => lowercaseText.includes(w)).length;
  let mixedCount = mixedWords.filter(w => lowercaseText.includes(w)).length;

  if ((negativeCount > 0 && positiveCount > 0) || mixedCount > 0) {
    sentiment = 'mixed';
    score = Math.floor(50 + Math.random() * 20); // 50 - 70
  } else if (negativeCount > positiveCount || lowercaseText.includes('worst') || lowercaseText.includes('avoid')) {
    sentiment = 'negative';
    score = Math.floor(10 + Math.random() * 30); // 10 - 40
  } else {
    sentiment = 'positive';
    score = Math.floor(82 + Math.random() * 16); // 82 - 98
  }

  // Extract themes
  if (lowercaseText.includes('clean') || lowercaseText.includes('dirty') || lowercaseText.includes('sheets') || lowercaseText.includes('immaculate')) {
    themes.push('Cleanliness');
  }
  if (lowercaseText.includes('bed') || lowercaseText.includes('sleep') || lowercaseText.includes('comfy') || lowercaseText.includes('cozy')) {
    themes.push('Comfort & Bedding');
  }
  if (lowercaseText.includes('pool') || lowercaseText.includes('ac') || lowercaseText.includes('wifi') || lowercaseText.includes('kitchen') || lowercaseText.includes('amenities')) {
    themes.push('Property Amenities');
  }
  if (lowercaseText.includes('host') || lowercaseText.includes('cookies') || lowercaseText.includes('friendly') || lowercaseText.includes('responsive')) {
    themes.push('Host Hospitality');
  }
  if (lowercaseText.includes('check-in') || lowercaseText.includes('wait') || lowercaseText.includes('delay') || lowercaseText.includes('keys')) {
    themes.push('Check-in Experience');
  }
  if (lowercaseText.includes('noise') || lowercaseText.includes('quiet') || lowercaseText.includes('loud') || lowercaseText.includes('location')) {
    themes.push('Location & Ambience');
  }

  if (themes.length === 0) {
    themes = ['Overall Guest Experience', 'Property Quality'];
  }

  // Generate Review Summary
  let summary = '';
  if (sentiment === 'positive') {
    summary = `The guest expressed high satisfaction with their stay at ${propertyName}, highlighting pleasant amenities and hospitality.`;
  } else if (sentiment === 'mixed') {
    summary = `The guest enjoyed parts of their stay at ${propertyName}, but noted concerns regarding ${themes[0] || 'certain amenities'}.`;
  } else {
    summary = `The guest reported a negative experience at ${propertyName} primarily due to issues with ${themes.join(' and ')}.`;
  }

  // Construct Tone-based Response
  let reply = '';
  const formattedThemes = themes.join(', ').toLowerCase();

  switch (tone.toLowerCase()) {
    case 'empathetic':
      if (sentiment === 'positive') {
        reply = `Dear Guest,\n\nWe are truly touched by your wonderful review of ${propertyName}! Knowing that you felt so comfortable during your stay means the world to our team. Thank you for choosing us, and we cannot wait to welcome you home again soon!\n\nWarmest regards,\n${propertyName} Team`;
      } else if (sentiment === 'mixed') {
        reply = `Dear Guest,\n\nThank you for sharing your thoughtful feedback. We are happy that you enjoyed your stay overall, but we deeply care about your experience with ${formattedThemes}. We genuinely apologize for any discomfort caused and are resolving this immediately. We hope to welcome you back for a flawless stay next time!\n\nWarmly,\n${propertyName} Team`;
      } else {
        reply = `Dear Guest,\n\nWe are deeply saddened to hear about your experience at ${propertyName}. Your comfort is our highest priority, and we apologize sincerely for failing to meet standards regarding ${formattedThemes}. We are taking immediate corrective actions. Please allow us the opportunity to make this right by contacting us directly.\n\nHeartfelt regards,\nGuest Relations Team`;
      }
      break;

    case 'enthusiastic':
      if (sentiment === 'positive') {
        reply = `Hi Guest!\n\nWOW! Thank you so much for the fantastic 5-star review of ${propertyName}! 🎉 We are absolutely thrilled to hear how much you loved your stay and enjoyed our hospitality! We can't wait to host your next amazing getaway!\n\nCheers & Sunshine,\n${propertyName} Team`;
      } else if (sentiment === 'mixed') {
        reply = `Hi Guest!\n\nThank you for checking in with us and sharing your review of ${propertyName}! We're super excited you loved key parts of your stay, and we are already taking action on ${formattedThemes} to make things 100% perfect for your next visit!\n\nBest vibes,\n${propertyName} Team`;
      } else {
        reply = `Hi Guest,\n\nThank you for bringing this to our attention. We are fully committed to making things right at ${propertyName}! We're tackling the issues with ${formattedThemes} head-on so every future guest has an incredible experience. Please reach out to us directly!\n\nBest regards,\n${propertyName} Management`;
      }
      break;

    case 'de-escalating':
      if (sentiment === 'negative' || sentiment === 'mixed') {
        reply = `Dear Guest,\n\nThank you for bringing your concerns to our immediate attention. We apologize unreservedly for the inconvenience experienced regarding ${formattedThemes} during your stay at ${propertyName}. We take operational standards very seriously and have dispatched our maintenance and housekeeping staff to audit these items today. Our management team would like to contact you directly to offer appropriate restitution.\n\nSincerely,\nExecutive Management, ${propertyName}`;
      } else {
        reply = `Dear Guest,\n\nThank you for taking the time to share your review of ${propertyName}. We appreciate your positive comments and note your observations. Maintaining pristine standards is our commitment to every guest.\n\nSincerely,\nManagement, ${propertyName}`;
      }
      break;

    case 'professional':
    default:
      if (sentiment === 'positive') {
        reply = `Hi Guest,\n\nThank you so much for taking the time to leave a review. We are delighted to hear you enjoyed your stay at ${propertyName}! Your feedback regarding our hospitality and amenities is greatly appreciated. We look forward to hosting you again.\n\nBest regards,\n${propertyName} Management`;
      } else if (sentiment === 'mixed') {
        reply = `Hi Guest,\n\nThank you for your review of ${propertyName}. We appreciate your positive feedback as well as your constructive comments regarding ${formattedThemes}. We have passed this feedback to our management team for immediate improvement. We hope to welcome you back in the future.\n\nBest regards,\n${propertyName} Management`;
      } else {
        reply = `Hi Guest,\n\nWe regret to hear about your experience at ${propertyName}. We apologize for the issues you encountered regarding ${formattedThemes}. Cleanliness and guest satisfaction are top priorities for us, and we are addressing these concerns with our team immediately. Please contact management directly so we can resolve this matter.\n\nSincerely,\nCustomer Relations, ${propertyName}`;
      }
      break;
  }

  return { sentiment, score, themes, summary, reply };
};

/**
 * Call External Gemini API (gemini-1.5-flash / gemini-2.0-flash)
 */
const callGeminiAPI = async (apiKey, propertyName, text, tone) => {
  const promptText = `You are an AI Hospitality Assistant for homestay properties.
Analyze the following guest review for property "${propertyName}".

Review Text:
"""
${text}
"""

Requested Response Tone: ${tone}

Please analyze the review and generate a response. Return ONLY a valid JSON object matching this schema EXACTLY without markdown formatting or code blocks:
{
  "sentiment": "positive" | "mixed" | "negative",
  "score": integer between 0 and 100,
  "themes": ["array of 2 to 5 theme strings"],
  "summary": "1 to 2 sentence summary of the guest review",
  "reply": "complete drafted host response matching the requested tone"
}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promptText }]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json"
        }
      })
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
  const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
  
  if (!textOutput) {
    throw new Error('Gemini API returned an empty content response');
  }

  // Clean raw output in case code block backticks were returned
  const cleanedText = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleanedText);

  return {
    sentiment: parsed.sentiment || 'positive',
    score: typeof parsed.score === 'number' ? parsed.score : 85,
    themes: Array.isArray(parsed.themes) ? parsed.themes : ['Hospitality'],
    summary: parsed.summary || `Summary for stay at ${propertyName}`,
    reply: parsed.reply || `Thank you for staying at ${propertyName}!`
  };
};

/**
 * POST /api/ai/analyze
 * Accepts: { propertyName, text, tone }
 * Returns: { success: true, data: { sentiment, score, themes, summary, reply, tone, provider } }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { propertyName, text, tone = 'Professional' } = req.body;

    // Validate Input
    if (!propertyName || !propertyName.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing Property Name',
        message: 'Please provide a property name for the analysis.'
      });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Missing Review Text',
        message: 'Please enter or paste a guest review to analyze.'
      });
    }

    if (text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Input Too Short',
        message: 'Review text must be at least 10 characters long for AI analysis.'
      });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    let result = null;
    let provider = 'fallback-local-engine';

    // Attempt Gemini call if API key present
    if (geminiKey && geminiKey !== 'your_gemini_api_key_here') {
      try {
        console.log(`[AI Route] Calling Google Gemini API for property "${propertyName}"...`);
        result = await callGeminiAPI(geminiKey, propertyName, text, tone);
        provider = 'google-gemini-1.5-flash';
      } catch (geminiError) {
        console.warn(`[AI Route] Gemini API call failed (${geminiError.message}). Falling back to local engine.`);
      }
    }

    // Fallback to local heuristic engine if API key missing or external call failed
    if (!result) {
      console.log(`[AI Route] Using Intelligent Local Analysis Engine for property "${propertyName}"...`);
      result = generateLocalAnalysis(propertyName, text, tone);
    }

    return res.status(200).json({
      success: true,
      data: {
        ...result,
        propertyName: propertyName.trim(),
        toneUsed: tone,
        provider,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[AI Route Error]', error);
    return res.status(500).json({
      success: false,
      error: 'AI Analysis Error',
      message: error.message || 'An unexpected error occurred while generating AI insights.'
    });
  }
});

/**
 * POST /api/ai/summarise (Alias endpoint for /api/ai/analyze to meet prompt requirements)
 */
router.post('/summarise', async (req, res) => {
  req.url = '/analyze';
  return router.handle(req, res);
});

export default router;
