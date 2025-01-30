import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://aayushgote03:Aayushgote@cluster0.afiem.mongodb.net/APP-DATABASE?retryWrites=true&w=majority&appName=Cluster0'


async function connectToDatabase() {
  try {
      const conn = await mongoose.connect(MONGODB_URI);
      const db = conn.connection.db;
      console.log('connected to mongodb');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export default connectToDatabase;





