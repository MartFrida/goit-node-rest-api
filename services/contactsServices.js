import fs from 'fs/promises'
import { nanoid } from 'nanoid'
import path from 'path'

const contactsPath = path.resolve('db', 'contacts.json')
const updateContacts = contacts => fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2))

export async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8")
  return JSON.parse(data)
}

export async function getContactById(contactId) {
  const contacts = await listContacts()
  const result = contacts.find(item => item.id === contactId)
  return result || null
}

export async function removeContact(contactId) {
  const contacts = await listContacts()
  const index = contacts.findIndex(item => item.id === contactId)
  if (index === -1) {
    return null
  }
  const [result] = contacts.splice(index, 1)
  await updateContacts(contacts)
  return result
}

export async function addContact(data) {
  const contacts = await listContacts()
  const newContact = {
    id: nanoid(),
    ...data,
  }
  contacts.push(newContact)
  await updateContacts(contacts)
  return newContact
}