'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Eye, Download } from 'lucide-react'

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
}

export default function AdminPage() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/contacts', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'demo-key'}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch contacts')
      }

      const data = await response.json()
      setContacts(data.data || [])
    } catch (err) {
      setError('Failed to load contacts')
      console.error('Error fetching contacts:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteContact = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/contacts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || 'demo-key'}`
        },
        body: JSON.stringify({ id })
      })

      if (!response.ok) {
        throw new Error('Failed to delete contact')
      }

      // Remove from local state
      setContacts(contacts.filter(contact => contact.id !== id))
    } catch (err) {
      console.error('Error deleting contact:', err)
      alert('Failed to delete contact')
    }
  }

  const exportContacts = () => {
    const dataStr = JSON.stringify(contacts, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `contacts-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading contacts...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchContacts}
            className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Contact Submissions
            </h1>
            <div className="flex gap-4">
              <button
                onClick={exportContacts}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={fetchContacts}
                className="bg-accent-500 text-white px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>

          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No contact submissions yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contacts.map((contact) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {contact.name}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(contact.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {contact.email}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 text-sm">
                        {contact.message.length > 100 
                          ? `${contact.message.substring(0, 100)}...`
                          : contact.message
                        }
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedContact(contact)}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => deleteContact(contact.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Contact Details
                </h2>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedContact.name}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedContact.email}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {selectedContact.message}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Submitted
                  </label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedContact.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
} 