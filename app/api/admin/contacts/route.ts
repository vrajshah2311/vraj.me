import { NextRequest, NextResponse } from 'next/server'
import { getAllContacts, deleteContact } from '@/lib/database'

// Simple authentication (you should implement proper auth in production)
const isAuthorized = (request: NextRequest) => {
  const authHeader = request.headers.get('authorization')
  const apiKey = process.env.ADMIN_API_KEY
  
  if (!apiKey) {
    console.warn('ADMIN_API_KEY not set - allowing all requests')
    return true
  }
  
  return authHeader === `Bearer ${apiKey}`
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const contacts = getAllContacts()
    
    return NextResponse.json({
      success: true,
      data: contacts,
      count: contacts.length
    })

  } catch (error) {
    console.error('Error fetching contacts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID is required' },
        { status: 400 }
      )
    }

    const deleted = deleteContact(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Contact not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting contact:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 