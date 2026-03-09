import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing email or OTP' }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    const user = await User.findOne({ email: lowerEmail })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (!user.otp || user.otp !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 })
    }

    if (new Date() > user.otpExpiry) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 })
    }

    // Mark user as verified and clear OTP
    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    const token = signToken({ userId: user._id.toString(), email: user.email, name: user.name })
    
    // We send back user data so the frontend can set user state
    const response = NextResponse.json({ 
      success: true, 
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, address: user.address }
    }, { status: 200 })
    
    response.cookies.set('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 7 * 24 * 3600 })
    return response
  } catch (err) {
    console.error('Verify error:', err)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
