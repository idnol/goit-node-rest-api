// import contactsService from "../services/contactsServices.js";
const {listContacts, getContactById, removeContact, addContact, updateContactById} = require('../services/contactsServices')
const {createContactSchema, updateContactSchema} = require("../schemas/contactsSchemas");
const getAllContacts = async (req, res) => {
    try {
        const result = await listContacts();
        res.json(result);
        if (!result) {
            res.status(404).json({message: 'Not found'})
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }

};

const getOneContact = async (req, res) => {
    try {
        const result = await getContactById(req.params.id);

        if (result.length === 0) {
            res.status(404).json({message: 'Not found'})
        } else {
            res.json(result);
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }

};

const deleteContact = async (req, res) => {
    try {
        const result = await removeContact(req.params.id);

        if (!result) {
            res.status(404).json({message: 'Not found'})
        } else {
            res.json(result);
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }

};

const createContact = async (req, res) => {
    try {
        const result = await addContact(req.query);
        const validate = await createContactSchema.validateAsync(result);
        console.log(validate)
        res.json(result);
        if (!result) {
            res.status(404).json({message: 'Not found'})
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }

};

const updateContact = async (req, res) => {
    try {
        const result = await updateContactById(req.params.id, req.query);
        const validate = await updateContactSchema.validateAsync(req.query);
        console.log(validate)
        res.json(result);
        if (!result) {
            res.status(404).json({message: 'Not found'})
        }
    } catch (e) {
        res.status(500).json({message: e.message})
    }

};

module.exports = {getAllContacts, getOneContact, deleteContact, createContact, updateContact}
