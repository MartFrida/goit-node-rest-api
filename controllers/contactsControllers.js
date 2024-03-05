import * as contactsService from "../services/contactsServices.js";
import HttpError from '../helpers/HttpError.js'
import ctrlWrapper from "../decorators/ctrlWrapper.js";
import path from 'path';
import fs from 'fs/promises'

const contactsDir = path.resolve('public', 'contacts')

const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const result = await contactsService.getListContactsByFilter({ owner }, { skip, limit })
  const total = await contactsService.getContactsCountByFilter({ owner })
  res.status(200).json({
    total,
    result
  })
};

const getOneContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params
  // const result = await contactsService.getContactById(id)
  const result = await contactsService.getContactByFilter({ _id: id, owner })
  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.status(200).json(result)
};

const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params
  // const result = await contactsService.removeContact(id)
  const result = await contactsService.removeContactByFilter({ _id: id, owner })
  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.status(200).json(result)
};

const createContact = async (req, res) => {
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(contactsDir, filename)
  await fs.rename(oldPath, newPath)
  const photo = path.join('contacts', filename)
  // console.log(req.body)
  // console.log(req.file)
  const { _id: owner } = req.user;
  const result = await contactsService.addContact({ ...req.body, photo, owner })
  res.status(201).json(result)
};

const updateContact = async (req, res) => {
  const { _id: owner } = req.user;
  if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field")
  }
  const { id } = req.params
  const result = await contactsService.updateContact(id, req.body)
  if (!result) {
    throw HttpError(404)
  }
  res.json(result)
};

const updateContactFavorite = async (req, res) => {
  const { id } = req.params
  const result = await contactsService.updateStatusContact(id, req.body)
  if (!result) {
    throw HttpError(404)
  }
  res.json(result)
}

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateContactFavorite: ctrlWrapper(updateContactFavorite),
}