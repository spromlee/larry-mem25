import mongoose, { Document, Schema } from "mongoose";

export interface INotice extends Document {
  title?: string;
  description: string;
  imageUrl?: string;
  location?: string;
  time?: string;
  date?: string;
  createdAt: Date;
}

const NoticeSchema: Schema = new Schema({
  title: { type: String },
  description: { type: String, required: true },
  imageUrl: { type: String },
  location: { type: String },
  time: { type: String },
  date: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notice || mongoose.model<INotice>("Notice", NoticeSchema);
