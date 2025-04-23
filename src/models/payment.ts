import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'bank', 'transfer', 'cash'], required: true },
  transactionId: { type: String, required: true },
  status: { type: String, enum: ['pending', 'successful', 'failed'], default: 'pending' },
  receiptUrl: { type: String },
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema);