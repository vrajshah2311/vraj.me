import fs from 'fs'
import path from 'path'

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  timestamp: string
}

const DB_FILE = path.join(process.cwd(), 'data', 'contacts.json')

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.dirname(DB_FILE)
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

// Read contacts from file
export const readContacts = (): ContactSubmission[] => {
  try {
    ensureDataDir()
    if (!fs.existsSync(DB_FILE)) {
      return []
    }
    const data = fs.readFileSync(DB_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading contacts:', error)
    return []
  }
}

// Write contacts to file
export const writeContacts = (contacts: ContactSubmission[]) => {
  try {
    ensureDataDir()
    fs.writeFileSync(DB_FILE, JSON.stringify(contacts, null, 2))
  } catch (error) {
    console.error('Error writing contacts:', error)
    throw error
  }
}

// Add new contact submission
export const addContact = (submission: Omit<ContactSubmission, 'id' | 'timestamp'>) => {
  const contacts = readContacts()
  const newContact: ContactSubmission = {
    ...submission,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  }
  
  contacts.push(newContact)
  writeContacts(contacts)
  
  return newContact
}

// Get all contacts (for admin purposes)
export const getAllContacts = (): ContactSubmission[] => {
  return readContacts()
}

// Delete contact by ID
export const deleteContact = (id: string): boolean => {
  const contacts = readContacts()
  const filteredContacts = contacts.filter(contact => contact.id !== id)
  
  if (filteredContacts.length === contacts.length) {
    return false // Contact not found
  }
  
  writeContacts(filteredContacts)
  return true
}

// Backup contacts to a timestamped file
export const backupContacts = () => {
  const contacts = readContacts()
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFile = path.join(process.cwd(), 'data', `contacts-backup-${timestamp}.json`)
  
  try {
    ensureDataDir()
    fs.writeFileSync(backupFile, JSON.stringify(contacts, null, 2))
    console.log(`Backup created: ${backupFile}`)
    return backupFile
  } catch (error) {
    console.error('Error creating backup:', error)
    throw error
  }
} 