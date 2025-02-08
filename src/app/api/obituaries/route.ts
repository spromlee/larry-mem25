import { NextRequest, NextResponse } from "next/server";
import {connectDB} from "@/lib/mongodb";
import Obituary from "@/models/Obituary";

export async function GET() {
  await connectDB();
  const obituaries = await Obituary.find({});
  return NextResponse.json(obituaries);
}

export async function POST(req: NextRequest) {
  await connectDB();
  const data = await req.json();
  const newObituary = new Obituary(data);
  await newObituary.save();
  return NextResponse.json(newObituary, { status: 201 });
}
