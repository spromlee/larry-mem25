import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function GET() {
  try {
    await connectDB();
    const notices = await Notice.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notices' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const newNotice = new Notice({
      ...data,
      createdAt: new Date(),
    });
    await newNotice.save();
    return NextResponse.json(
      { success: true, notice: newNotice },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notice' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const id = req.url.split('/').pop();
    await Notice.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete notice' },
      { status: 500 }
    );
  }
}
