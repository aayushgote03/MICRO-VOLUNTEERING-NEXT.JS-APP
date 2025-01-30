import Grid from 'gridfs-stream';
import connectToDatabase from './db';
import mongoose from 'mongoose';

let gfs;

const initializeGfs = async () => {
  await connectToDatabase(); // Ensure DB connection is established before initializing GridFS
  const db = mongoose.connection.db;
  gfs = Grid(db, mongoose.mongo); // Initialize GridFS
  gfs.collection('uploads'); // Specify collection name for GridFS

  console.log('GridFS initialized');
};

export { initializeGfs, gfs };
