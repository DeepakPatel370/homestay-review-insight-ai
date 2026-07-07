import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  propertyName: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'mixed', 'negative'],
    required: true,
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  themes: {
    type: [String],
    default: [],
  },
  reply: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'responded'],
    default: 'responded',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  }
});

// Configure JSON serialization virtuals and transform
reviewSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Review', reviewSchema);
