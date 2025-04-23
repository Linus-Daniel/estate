import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  type: { type: String, enum: ['apartment', 'house', 'condo', 'land'], required: true },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area: { type: Number }, // in square feet/meters
  amenities: [{ type: String }],
  images: [{ type: String }],
  status: { type: String, enum: ['available', 'rented', 'sold', 'maintenance'], default: 'available' },
  agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Property || mongoose.model('Property', propertySchema);