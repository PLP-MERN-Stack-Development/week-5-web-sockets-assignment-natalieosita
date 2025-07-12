import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  to: { type: String, default: null }, // null for public
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: String }],
});

export const Message = mongoose.model('Message', messageSchema);