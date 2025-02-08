import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';

async function resetGalleryCollection() {
  try {
    await connectDB();
    
    // Drop the existing collection
    await mongoose.connection.collection('galleryimages').drop();
    console.log('Successfully dropped galleryimages collection');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error resetting gallery collection:', error);
  }
}

resetGalleryCollection();
