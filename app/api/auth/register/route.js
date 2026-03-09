import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { signToken } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    const { name, email, password, phone } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const lowerEmail = email.toLowerCase()
    const existing = await User.findOne({ email: lowerEmail })

    if (existing && existing.isVerified) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)

    if (existing && !existing.isVerified) {
      existing.name = name
      existing.password = hashed
      existing.phone = phone || existing.phone
      existing.otp = otp
      existing.otpExpiry = otpExpiry
      await existing.save()
    } else {
      await User.create({ name, email: lowerEmail, password: hashed, phone: phone || '', isVerified: false, otp, otpExpiry })
    }

    const { sendOTP } = await import('@/lib/email')
    const sent = await sendOTP(lowerEmail, otp)

    if (!sent) {
      return NextResponse.json({
        error: 'Failed to send verification email. Please check server configuration.',
        details: 'Email service authentication failed or is not configured.'
      }, { status: 500 })
    }

    return NextResponse.json({ requireOtp: true, message: 'OTP sent to email', email: lowerEmail }, { status: 201 })
  } catch (err) {
    console.error('Registration Error:', err)
    return NextResponse.json({ error: `Registration failed: ${err.message}` }, { status: 500 })
  }
}
