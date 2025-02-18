import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Memory } from "@/models/Memory";
import { storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';
    
    const query = showAll ? {} : { isApproved: true };
    const memories = await Memory.find(query)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({ 
      success: true, 
      memories 
    });
  } catch (error) {
    console.error('Error fetching memories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch memories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    const newMemory = new Memory({
      fullName: data.fullName,
      email: data.email,
      message: data.message,
      photos: data.photos || [],
      isApproved: false,
      createdAt: new Date()
    });

    await newMemory.save();

    return NextResponse.json({ 
      success: true, 
      memory: newMemory.toJSON() 
    });
  } catch (error) {
    console.error('Error saving memory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save memory' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, isApproved } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Memory ID is required' },
        { status: 400 }
      );
    }

    const memory = await Memory.findByIdAndUpdate(
      id,
      { isApproved },
      { new: true }
    );

    if (!memory) {
      return NextResponse.json(
        { success: false, error: 'Memory not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      memory: memory.toJSON() 
    });
  } catch (error) {
    console.error('Error updating memory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update memory' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Memory ID is required' },
        { status: 400 }
      );
    }

    const memory = await Memory.findById(id);
    if (!memory) {
      return NextResponse.json(
        { success: false, error: 'Memory not found' },
        { status: 404 }
      );
    }

    // Delete all associated photos from Firebase Storage
    if (memory.photos && memory.photos.length > 0) {
      for (const photoUrl of memory.photos) {
        try {
          const url = new URL(photoUrl);
          const imagePath = decodeURIComponent(url.pathname.substring(1));
          const imageRef = ref(storage, imagePath);
          await deleteObject(imageRef);
        } catch (error) {
          console.error('Error deleting photo from storage:', error);
        }
      }
    }

    // Delete from database
    await Memory.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'Memory deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting memory:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete memory' },
      { status: 500 }
    );
  }
}
