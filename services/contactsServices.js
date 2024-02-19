import Contact from '../models/Contact.js'


export const listContacts = () => Contact.find({}, "-createdAt -updatedAt")

export async function getContactById(contactId) {
  return Contact.findById(contactId)
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId)
}

export const addContact = (data) => Contact.create(data)

export async function updateContact(id, data) {
  return Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

export async function updateStatusContact(id, data) {
  return Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}