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

const {createContactSchema, updateContactSchema, updateContactFavoriteSchema} = joiSchemas;

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateContactFavoriteSchema), updateStatusContact);

module.exports = contactsRouter;
