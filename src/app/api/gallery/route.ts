import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { GalleryImage } from '@/models/GalleryImage';
import { storage } from '@/lib/firebase';
import { ref, deleteObject } from 'firebase/storage';

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    
    const newImage = new GalleryImage({
      imageUrl: data.imageUrl,
      caption: data.caption,
      email: data.email,
      category: data.category,
      isApproved: false // explicitly set isApproved
    });

    await newImage.save();

    return NextResponse.json({ 
      success: true, 
      image: newImage.toJSON() 
    });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save image' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('showAll') === 'true';
    
    const query = showAll ? {} : { isApproved: true };
    const images = await GalleryImage.find(query)
      .sort({ uploadedAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({ 
      success: true, 
      images: images 
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, isApproved } = data;

    const updatedImage = await GalleryImage.findByIdAndUpdate(
      id,
      { $set: { isApproved } },
      { 
        new: true,
        runValidators: true 
      }
    ).lean();

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      image: updatedImage
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update image' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      );
    }

    const image = await GalleryImage.findById(id);
    if (!image) {
      return NextResponse.json(
        { success: false, error: 'Image not found' },
        { status: 404 }
      );
    }

    // Delete from Firebase Storage
    try {
      const imageUrl = new URL(image.imageUrl);
      const imagePath = decodeURIComponent(imageUrl.pathname.substring(1));
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }

    // Delete from database
    await GalleryImage.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    );
  }
}
