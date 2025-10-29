import { NextResponse } from 'next/server'

/**
 * Contact Form API Route
 * Sends email notifications when someone submits the contact form
 * 
 * To enable email sending:
 * 1. Sign up at resend.com (free tier: 3,000 emails/month)
 * 2. Get your API key
 * 3. Create .env.local file with: RESEND_API_KEY=your_key
 * 4. Install: npm install resend
 * 5. Uncomment the Resend code below
 */

export async function POST(request) {
  try {
    const { name, email, message } = await request.json()

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // ============================================
    // OPTION 1: Resend (Recommended)
    // ============================================
    // Uncomment this after setting up Resend:
    
    /*
    const { Resend } = require('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Change after verifying domain
      to: 'shaansoni21@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    })
    */

    // ============================================
    // OPTION 2: Web3Forms (Simpler - No Backend Needed)
    // ============================================
    // Alternative: Use Web3Forms (get free key at web3forms.com)
    
    const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY
    
    if (WEB3FORMS_KEY) {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `Portfolio Contact from ${name}`,
          from_name: name,
          email: email,
          message: message,
          to: 'shaansoni21@gmail.com',
        }),
      })

      const data = await response.json()

      if (data.success) {
        return NextResponse.json({
          success: true,
          message: 'Email sent successfully!'
        })
      } else {
        throw new Error(data.message || 'Failed to send email')
      }
    }

    // ============================================
    // Fallback: Log to console (Development)
    // ============================================
    console.log('📧 Contact Form Submission:')
    console.log(`Name: ${name}`)
    console.log(`Email: ${email}`)
    console.log(`Message: ${message}`)

    // For now, return success (until you set up email service)
    return NextResponse.json({
      success: true,
      message: 'Message received! (Email service not yet configured)',
      note: 'Set up Resend or Web3Forms to receive emails'
    })

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}

