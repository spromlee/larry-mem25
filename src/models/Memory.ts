import mongoose, { Document, Schema } from "mongoose";

export interface IMemory extends Document {
  fullName: string;
  email: string;
  message: string;
  photos?: string[];
  isApproved: boolean;
  createdAt: Date;
}

const MemorySchema: Schema = new Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  photos: [{ 
    type: String 
  }],
  isApproved: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Delete the model if it exists to ensure schema changes are applied
if (mongoose.models.Memory) {
  delete mongoose.models.Memory;
}

export const Memory = mongoose.model<IMemory>('Memory', MemorySchema);
