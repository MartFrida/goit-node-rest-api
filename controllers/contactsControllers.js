import * as contactsService from "../services/contactsServices.js";
import HttpError from '../helpers/HttpError.js'
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js'
import ctrlWrapper from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const result = await contactsService.listContacts()
  res.status(200).json(result)
};

const getOneContact = async (req, res) => {
  const { id } = req.params
  const result = await contactsService.getContactById(id)
  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.status(200).json(result)
};

const deleteContact = async (req, res) => {

  const { id } = req.params
  const result = await contactsService.removeContact(id)

  if (!result) {
    throw HttpError(404, "Not found")
  }
  res.status(200).json(result)
};

const createContact = async (req, res) => {
  const result = await contactsService.addContact(req.body)
  res.status(201).json(result)
};

const updateContact = async (req, res) => {
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

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
}