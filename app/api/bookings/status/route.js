import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Booking from '@/models/Booking'
import Listing from '@/models/Listing'
import { getTokenFromRequest, verifyToken } from '@/lib/auth'

export async function PUT(request) {
  const token = getTokenFromRequest(request)
  const decoded = verifyToken(token)
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await connectDB()
    const { bookingId, deliveryStatus, pickupLocation, pickupTime, returnLocation } = await request.json()

    const booking = await Booking.findById(bookingId)
    if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

    // Only lender or renter can update
    if (booking.lenderId !== decoded.userId && booking.renterId !== decoded.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const update = {}
    if (deliveryStatus) update.deliveryStatus = deliveryStatus
    if (pickupLocation) update.pickupLocation = pickupLocation
    if (pickupTime) update.pickupTime = pickupTime
    if (returnLocation) update.returnLocation = returnLocation

    // If returned, mark listing as available again
    if (deliveryStatus === 'returned') {
      await Listing.findByIdAndUpdate(booking.listingId, { available: true })
      update.status = 'completed'
    }

    await Booking.findByIdAndUpdate(bookingId, update)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
