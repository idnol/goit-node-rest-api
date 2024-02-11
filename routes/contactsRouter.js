const express = require('express');

const {
  getAllContacts,
  createContact,
  getOneContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../controllers/contactsControllers");
const validateBody = require("../helpers/validateBody");
const {joiSchemas} = require("../models/contact");
const authenticate = require("../helpers/authenticate");

const {createContactSchema, updateContactSchema, updateContactFavoriteSchema} = joiSchemas;

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, getAllContacts);

contactsRouter.get("/:id", authenticate, getOneContact);

contactsRouter.delete("/:id", authenticate, deleteContact);

contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", authenticate, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", authenticate, validateBody(updateContactFavoriteSchema), updateStatusContact);

module.exports = contactsRouter;
