import { NextResponse } from 'next/server'
import crypto from 'crypto'
import connectDB from '@/lib/mongodb'
import Cart from '@/models/Cart'
import Booking from '@/models/Booking'
import Listing from '@/models/Listing'
import User from '@/models/User'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function POST(request) {
  const token = getTokenFromRequest(request)
  const decoded = verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { paymentId, orderId, signature, rentalStart, deliveryDetails, returnDetails, pickupDetails, collectDetails } = await request.json()

    // Verify Razorpay signature
    const body = orderId + '|' + paymentId
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    await connectDB()
    const cart = await Cart.findOne({ userId: decoded.userId })
    if (!cart || !cart.items.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Get renter info
    const renter = await User.findById(decoded.userId)

    const startDate = new Date(rentalStart)
    const bookings = []

    for (const item of cart.items) {
      const listing = await Listing.findById(item.listingId)
      if (!listing) continue

      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + item.days)

      const subtotal = item.rentalPricePerDay * item.days
      const platformFee = Math.round((subtotal + item.securityDeposit) * 0.05)
      const total = subtotal + item.securityDeposit + platformFee

      // Get lender info
      const lender = await User.findById(listing.ownerId)

      const booking = await Booking.create({
        listingId: item.listingId,
        listingName: item.name,
        listingImage: listing.imageData || listing.imageUrl || '',
        lenderId: listing.ownerId.toString(),
        lenderName: listing.ownerName || lender?.name || 'Community Member',
        lenderPhone: lender?.phone || '',
        renterId: decoded.userId,
        renterName: decoded.name || renter?.name || 'Renter',
        renterPhone: renter?.phone || '',
        days: item.days,
        rentalStart: startDate,
        rentalEnd: endDate,
        rentalPrice: subtotal,
        securityDeposit: item.securityDeposit,
        totalAmount: total,
        status: 'confirmed',
        deliveryStatus: 'pending',
        pickupLocation: lender?.address || 'To be communicated',
        returnDeadline: endDate,
        deliveryDetails,
        returnDetails,
        pickupDetails,
        collectDetails,
        paymentId,
        orderId
      })
      bookings.push(booking)

      // Mark listing as unavailable
      await Listing.findByIdAndUpdate(item.listingId, { available: false })
    }

    // Clear cart
    await Cart.deleteOne({ userId: decoded.userId })

    return NextResponse.json({ success: true, bookings: bookings.length })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
