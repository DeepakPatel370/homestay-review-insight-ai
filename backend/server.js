import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { errorHandler } from './middleware/errorHandler.js';
import reviewsRouter from './routes/reviews.js';
import Property from './models/Property.js';
import Review from './models/Review.js';

// Load environment variables
dotenv.config();

// Seed function for default reviews
const seedDatabase = async () => {
  try {
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      console.log('🌱 Database is empty. Seeding initial reviews...');
      
      let property = await Property.findOne({ name: 'Sunset Haven Villa' });
      if (!property) {
        property = await Property.create({ name: 'Sunset Haven Villa' });
      }

      const seedReviews = [
        {
          property: property._id,
          propertyName: 'Sunset Haven Villa',
          text: 'We had the most wonderful stay! The host left us fresh cookies, the house was immaculate, and the beds were so comfy. 10/10 will come back!',
          sentiment: 'positive',
          score: 98,
          themes: ['Hospitality', 'Cleanliness', 'Comfort'],
          reply: `Hi Guest,\n\nThank you so much for your glowing review! We are absolutely thrilled to hear you enjoyed the cookies and found the beds comfortable. Maintaining an immaculate home and providing top-notch hospitality here at Sunset Haven Villa is our priority. We look forward to welcoming you back for another 10/10 stay!\n\nBest regards,\nSunset Haven Villa Team`,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          status: 'responded'
        },
        {
          property: property._id,
          propertyName: 'Sunset Haven Villa',
          text: 'The villa was absolutely stunning! Clean pools, great layout. Only issue was check-in instructions were outdated and we had to wait 30 minutes outside.',
          sentiment: 'mixed',
          score: 55,
          themes: ['Amenities', 'Check-in Delay', 'Villa Quality'],
          reply: `Hi Guest,\n\nThank you for sharing your feedback. We are happy that you enjoyed the stunning villa and clean pool! However, we sincerely apologize for the delay during check-in due to the outdated instructions. We have updated our check-in guide at Sunset Haven Villa immediately to ensure this does not happen again. We hope to host you again for a seamless experience.\n\nWarm regards,\nSunset Haven Villa Team`,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          status: 'responded'
        },
        {
          property: property._id,
          propertyName: 'Sunset Haven Villa',
          text: 'Worst experience ever. The sheets were dirty, the air conditioning was leaking, and the host refused to refund us. Avoid!',
          sentiment: 'negative',
          score: 12,
          themes: ['Cleanliness', 'AC Issue', 'Refund Dispute'],
          reply: `Hi Guest,\n\nWe are deeply sorry to hear about your experience. Cleanliness and functional amenities are critical to us at Sunset Haven Villa, and we apologize that the sheets and air conditioning fell short. We take these matters seriously and are addressing them with our operations team immediately. Regarding your refund request, our management is reviewing the logs to resolve this fairly. We appreciate your feedback.\n\nSincerely,\nCustomer Relations`,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'pending'
        }
      ];

      await Review.insertMany(seedReviews);
      console.log('✅ Seeding completed successfully!');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/insightstay';
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('💾 Connected to MongoDB successfully!');
    await seedDatabase();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });


const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with dynamic settings
app.use(cors({
  origin: '*', // Allow all origins for initial testing, can narrow down to http://localhost:5173
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[Request] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Register API Routes
app.use('/api/reviews', reviewsRouter);

// Undefined routes handler (404)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Register custom Error Handler Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`📡 Listening on http://localhost:${PORT}`);
  console.log(`=================================================`);
});
