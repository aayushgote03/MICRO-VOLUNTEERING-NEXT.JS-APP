import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    data: { type: String, required: true },  // Ensure this matches your data field
});

export default mongoose.models.Image || mongoose.model('Image', imageSchema);
