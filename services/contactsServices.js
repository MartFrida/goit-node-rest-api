import Contact from '../models/Contact.js'

export const listContacts = () => Contact.find({}, "-createdAt -updatedAt")

export const getListContactsByFilter = (filter, query) => Contact.find(filter, "-createdAt -updatedAt", query)

export const getContactsCountByFilter = filter => Contact.countDocuments(filter)

export async function getContactById(contactId) {
  return Contact.findById(contactId)
}
export async function getContactByFilter(filter) {
  return Contact.findOne(filter)
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId)
}

export async function removeContactByFilter(filter) {
  return Contact.findOneAndDelete(filter)
}

export const addContact = (data) => Contact.create(data)

export async function updateContact(id, data) {
  return Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}

export async function updateContactByFilter(filter, data) {
  return Contact.findOneAndUpdate(filter, data, { new: true, runValidators: true })
}

export async function updateStatusContact(id, data) {
  return Contact.findByIdAndUpdate(id, data, { new: true, runValidators: true })
}