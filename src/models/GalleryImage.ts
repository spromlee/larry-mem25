import mongoose, { Schema } from 'mongoose';

// Define the interface for GalleryImage document
interface IGalleryImage {
  imageUrl: string;
  caption: string;
  email: string;
  isApproved: boolean;
  uploadedAt: Date;
  category: string;
}

const galleryImageSchema = new Schema<IGalleryImage>({
  imageUrl: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Portrait', 'Family activities', 'Loving couple'],
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  // Add timestamps for createdAt and updatedAt
  timestamps: true,
  // Ensure virtuals are included in JSON
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Delete the model if it exists to ensure schema changes are applied
if (mongoose.models.GalleryImage) {
  delete mongoose.models.GalleryImage;
}

export const GalleryImage = mongoose.model<IGalleryImage>('GalleryImage', galleryImageSchema);
