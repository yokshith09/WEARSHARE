import mongoose from 'mongoose'

const BookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  listingName: String,
  listingImage: String,
  lenderId: String,
  lenderName: String,
  lenderPhone: String,
  renterId: String,
  renterName: String,
  renterPhone: String,
  days: Number,
  rentalStart: Date,
  rentalEnd: Date,
  rentalPrice: Number,
  totalAmount: Number,
  securityDeposit: Number,
  status: { type: String, default: 'confirmed' },
  deliveryStatus: { type: String, default: 'pending', enum: ['pending', 'ready_for_pickup', 'picked_up', 'in_use', 'returned'] },
  pickupLocation: { type: String, default: '' },
  pickupTime: { type: String, default: '' },
  returnLocation: { type: String, default: '' },
  returnDeadline: { type: Date },

  // New user logistics details
  deliveryDetails: { type: String, default: '' },
  returnDetails: { type: String, default: '' },
  pickupDetails: { type: String, default: '' },
  collectDetails: { type: String, default: '' },

  paymentId: String,
  orderId: String,
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema)
