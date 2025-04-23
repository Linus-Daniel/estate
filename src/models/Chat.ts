import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model('Chat', chatSchema);