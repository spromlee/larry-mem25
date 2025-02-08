import mongoose, { Document, Schema } from "mongoose";

export interface IObituary extends Document {
  name: string;
  birthDate: Date;
  deathDate: Date;
  description: string;
  images: string[];
}

const ObituarySchema: Schema = new Schema({
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  deathDate: { type: Date, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
});

export default mongoose.models.Obituary || mongoose.model<IObituary>("Obituary", ObituarySchema);
