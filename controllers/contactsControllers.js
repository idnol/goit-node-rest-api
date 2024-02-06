// import contactsService from "../services/contactsServices.js";
const {listContacts, getContactById, removeContact, addContact, updateContactById} = require('../services/contactsServices')
const HttpError = require("../helpers/HttpError");
const wrapper = require("../helpers/wrapper");

const getAllContacts = async (req, res, next) => {
    const result = await listContacts();

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const getOneContact = async (req, res, next) => {
    const result = await getContactById(req.params.id);

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const deleteContact = async (req, res, next) => {
    const result = await removeContact(req.params.id);

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const createContact = async (req, res, next) => {
    const result = await addContact(req.query);
    if (!result) {
        throw HttpError(404);
    }
    res.json(result);
};

const updateContact = async (req, res, next) => {
    const result = await updateContactById(req.params.id, req.query);

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

module.exports = {
    getAllContacts: wrapper(getAllContacts),
    getOneContact: wrapper(getOneContact),
    createContact: wrapper(createContact),
    deleteContact: wrapper(deleteContact),
    updateContact: wrapper(updateContact),
};
