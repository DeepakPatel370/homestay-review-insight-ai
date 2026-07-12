import express from 'express';
import Property from '../models/Property.js';
import Review from '../models/Review.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all reviews endpoints
router.use(requireAuth);

// Seed list of external reviews used when syncing
const SYNC_SOURCE_REVIEWS = [
  {
    propertyName: 'Sunset Haven Villa',
    text: 'Stunning property! The view is breathtaking and everything was exactly as shown in photos. Highly recommend!',
    sentiment: 'positive',
    score: 95,
    themes: ['View', 'Accuracy', 'Highly Recommended'],
    reply: `Hi Guest,\n\nThank you so much for the review! We're glad you enjoyed the breathtaking view and found the property matched our photos. Hope to host you again!\n\nBest, Sunset Haven Villa Team`
  },
  {
    propertyName: 'Sunset Haven Villa',
    text: 'Great location, very close to the beach. The kitchen was fully stocked. However, the wifi connection was extremely spotty.',
    sentiment: 'mixed',
    score: 62,
    themes: ['Location', 'Kitchen', 'Wifi Issue'],
    reply: `Hi Guest,\n\nWe are glad you liked our location and stocked kitchen! We apologize for the spotty wifi and have contacted our ISP to upgrade the router. Hope to welcome you back.\n\nBest, Sunset Haven Villa Team`
  },
  {
    propertyName: 'Sunset Haven Villa',
    text: 'Very noisy neighborhood due to local construction. I could not sleep at all during the mornings. Host was unresponsive.',
    sentiment: 'negative',
    score: 18,
    themes: ['Noise', 'Sleep quality', 'Unresponsive Host'],
    reply: `Hi Guest,\n\nWe apologize for the noise issues and the delay in response. The local construction was unscheduled and we are working with local authorities. We hope to make it up to you.\n\nSincerely, Management`
  }
];

// Helper to generate AI review analysis (Rule-based Simulation)
const analyzeReviewText = (propertyName, text) => {
  const lowercaseText = text.toLowerCase();
  
  let sentiment = 'positive';
  let score = 85;
  let themes = [];
  let reply = '';

  // Simple keyword matching for simulation
  const positiveWords = ['great', 'excellent', 'wonderful', 'perfect', 'clean', 'comfy', 'cozy', 'amazing', 'love', 'nice', 'delicious', 'immaculate', 'stunning'];
  const negativeWords = ['worst', 'dirty', 'leak', 'broken', 'smell', 'noise', 'rude', 'bad', 'slow', 'unresponsive', 'refund', 'avoid', 'poor'];
  const mixedWords = ['but', 'however', 'although', 'only issue', 'except', 'yet', 'issue was'];

  let positiveCount = positiveWords.filter(w => lowercaseText.includes(w)).length;
  let negativeCount = negativeWords.filter(w => lowercaseText.includes(w)).length;
  let mixedCount = mixedWords.filter(w => lowercaseText.includes(w)).length;

  // Determine sentiment & themes
  if ((negativeCount > 0 && positiveCount > 0) || (mixedCount > 0 && positiveCount > 0)) {
    sentiment = 'mixed';
    score = Math.floor(40 + Math.random() * 25); // 40 - 65
  } else if (negativeCount > 0 || lowercaseText.includes('worst') || lowercaseText.includes('avoid')) {
    sentiment = 'negative';
    score = Math.floor(5 + Math.random() * 30); // 5 - 35
  } else {
    sentiment = 'positive';
    score = Math.floor(75 + Math.random() * 23); // 75 - 98
  }

  // Populate themes based on text content
  if (lowercaseText.includes('clean') || lowercaseText.includes('dirty') || lowercaseText.includes('sheets')) {
    themes.push('Cleanliness');
  }
  if (lowercaseText.includes('bed') || lowercaseText.includes('sleep') || lowercaseText.includes('comfy')) {
    themes.push('Comfort');
  }
  if (lowercaseText.includes('ac') || lowercaseText.includes('air conditioning') || lowercaseText.includes('leak') || lowercaseText.includes('wifi') || lowercaseText.includes('kitchen') || lowercaseText.includes('pool')) {
    themes.push('Amenities');
  }
  if (lowercaseText.includes('host') || lowercaseText.includes('cookies') || lowercaseText.includes('unresponsive')) {
    themes.push('Hospitality');
  }
  if (lowercaseText.includes('check-in') || lowercaseText.includes('wait') || lowercaseText.includes('delay')) {
    themes.push('Check-in');
  }
  if (lowercaseText.includes('noise') || lowercaseText.includes('loud') || lowercaseText.includes('construction')) {
    themes.push('Noise Level');
  }

  // Add default themes if none detected
  if (themes.length === 0) {
    themes = ['Guest Experience', 'General Stay'];
  }

  // Generate Reply Draft
  if (sentiment === 'positive') {
    reply = `Hi Guest,\n\nThank you so much for taking the time to write a review. We are delighted to hear you had a great stay at ${propertyName}! We appreciate your kind words and look forward to welcoming you back in the future.\n\nWarm regards,\n${propertyName} Team`;
  } else if (sentiment === 'mixed') {
    reply = `Hi Guest,\n\nThank you for sharing your feedback. We are happy that you enjoyed elements of your stay at ${propertyName}. However, we sincerely apologize for the issues you experienced with ${themes.filter(t => t !== 'Guest Experience').join(', ').toLowerCase() || 'certain aspects of your visit'}. We are addressing these issues immediately to improve our service. We hope to host you again for a better experience.\n\nBest regards,\n${propertyName} Team`;
  } else {
    reply = `Hi Guest,\n\nWe are deeply sorry to hear that your stay at ${propertyName} did not meet your expectations. We apologize for the issues regarding ${themes.join(', ').toLowerCase()} and any frustration caused. We take clean and comfortable stays very seriously and are addressing this with our operations team immediately. We would love the opportunity to make this right. Please reach out to us directly.\n\nSincerely,\n${propertyName} Management`;
  }

  return { sentiment, score, themes, reply };
};

// 1. GET /api/reviews - Get all reviews (with optional search query `q` and filtering by `sentiment`)
router.get('/', async (req, res) => {
  try {
    const { q, sentiment } = req.query;
    let query = {};

    // Apply sentiment filter
    if (sentiment) {
      query.sentiment = sentiment.toLowerCase();
    }

    // Apply search query filter
    if (q) {
      const searchVal = q.toLowerCase();
      query.$or = [
        { text: new RegExp(searchVal, 'i') },
        { propertyName: new RegExp(searchVal, 'i') },
        { reply: new RegExp(searchVal, 'i') },
        { themes: new RegExp(searchVal, 'i') }
      ];
    }

    // Sort by createdAt descending
    const matchedReviews = await Review.find(query).sort({ createdAt: -1 });
    res.status(200).json(matchedReviews);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/reviews/stats - Calculate and return dashboard summary statistics
router.get('/stats', async (req, res) => {
  try {
    const reviews = await Review.find();
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return res.status(200).json({
        totalReviews: 0,
        avgRating: "0.0",
        sentimentIndex: '0%',
        aiResponses: 0
      });
    }

    // Calculate Average Rating out of 5.0 based on sentiment score (score is 0-100)
    // Mapping formula: rating = 1.0 + (score / 100) * 4.0
    const totalScore = reviews.reduce((sum, r) => sum + r.score, 0);
    const avgScore = totalScore / totalReviews;
    const avgRating = (1.0 + (avgScore / 100) * 4.0).toFixed(1);

    // Calculate Sentiment Index: percentage of reviews that are positive or mixed
    const positiveOrMixed = reviews.filter(r => r.sentiment === 'positive' || r.sentiment === 'mixed').length;
    const sentimentIndex = `${Math.round((positiveOrMixed / totalReviews) * 100)}%`;

    // Count generated replies
    const aiResponses = reviews.filter(r => r.reply && r.reply.length > 0).length;

    res.status(200).json({
      totalReviews,
      avgRating,
      sentimentIndex,
      aiResponses
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. GET /api/reviews/:id - Get details of a single review
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json(review);
  } catch (error) {
    // Check if error is due to invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. POST /api/reviews - Add a new review and analyze it
router.post('/', async (req, res) => {
  try {
    const { propertyName, text } = req.body;

    if (!propertyName || !propertyName.trim()) {
      return res.status(400).json({ success: false, message: 'Property name is required.' });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Review text is required.' });
    }

    // Perform Simulated AI analysis
    const analysis = analyzeReviewText(propertyName, text);

    // Find or create associated Property
    let property = await Property.findOne({ name: propertyName.trim() });
    if (!property) {
      property = await Property.create({ name: propertyName.trim() });
    }

    const newReview = await Review.create({
      property: property._id,
      propertyName: propertyName.trim(),
      text: text.trim(),
      ...analysis,
      status: 'responded'
    });

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 5. PUT /api/reviews/:id - Update a review or its suggested response
router.put('/:id', async (req, res) => {
  try {
    const { propertyName, text, sentiment, score, themes, reply, status } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (propertyName !== undefined) {
      review.propertyName = propertyName;
      // Also update or associate property reference
      let property = await Property.findOne({ name: propertyName.trim() });
      if (!property) {
        property = await Property.create({ name: propertyName.trim() });
      }
      review.property = property._id;
    }
    if (text !== undefined) review.text = text;
    if (sentiment !== undefined) review.sentiment = sentiment;
    if (score !== undefined) review.score = score;
    if (themes !== undefined) review.themes = themes;
    if (reply !== undefined) review.reply = reply;
    if (status !== undefined) review.status = status;
    review.updatedAt = new Date();

    const updatedReview = await review.save();
    res.status(200).json(updatedReview);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 6. DELETE /api/reviews/:id - Delete a review
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(204).send(); // 204 No Content
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// 7. POST /api/reviews/sync - Simulate review syncing from external channels (Airbnb & Vrbo)
router.post('/sync', async (req, res) => {
  try {
    const newlySynced = [];
    for (const r of SYNC_SOURCE_REVIEWS) {
      let property = await Property.findOne({ name: r.propertyName });
      if (!property) {
        property = await Property.create({ name: r.propertyName });
      }
      const newReview = await Review.create({
        property: property._id,
        propertyName: r.propertyName,
        text: r.text,
        sentiment: r.sentiment,
        score: r.score,
        themes: [...r.themes],
        reply: r.reply,
        status: 'responded'
      });
      newlySynced.push(newReview);
    }

    res.status(200).json({
      success: true,
      message: `${newlySynced.length} reviews synced from Airbnb & Vrbo!`,
      syncedCount: newlySynced.length,
      reviews: newlySynced
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
