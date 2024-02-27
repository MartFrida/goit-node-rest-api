import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import validateBody from '../helpers/validateBody.js'
import { createContactSchema, updateContactSchema, updateContactFavoriteSchema } from '../schemas/contactsSchemas.js'
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js"

const {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
} = contactsControllers;

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", isValidId, validateBody(updateContactFavoriteSchema), updateContact);

export default contactsRouter;
