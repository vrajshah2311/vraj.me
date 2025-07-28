import { NextRequest, NextResponse } from 'next/server'
import { addContact, backupContacts } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Save to local database
    const contact = addContact({
      name,
      email,
      message
    })

    // Create backup (optional - you can remove this in production)
    try {
      backupContacts()
    } catch (backupError) {
      console.warn('Backup failed:', backupError)
    }

    // Here you would typically:
    // 1. Send email notification
    // 2. Log to external service
    // 3. Integrate with CRM

    console.log('Contact form submission saved:', contact)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! I\'ll get back to you soon.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 