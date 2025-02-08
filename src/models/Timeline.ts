import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  location: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Timeline = mongoose.models.Timeline || mongoose.model('Timeline', timelineSchema);

export default Timeline;
