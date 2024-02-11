const HttpError = require("../helpers/HttpError");
const wrapper = require("../helpers/wrapper");
const {Contact} = require('../models/contact');

const getAllContacts = async (req, res) => {
    const {_id: owner} = req.user;
    const result = await Contact.find({owner});
    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const getOneContact = async (req, res) => {
    const result = await Contact.findById(req.params.id);

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const deleteContact = async (req, res) => {
    const result = await Contact.findByIdAndDelete(req.params.id);

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const createContact = async (req, res) => {
    const {id: owner} = req.user;
    const result = await Contact.create({...req.body, owner});
    if (!result) {
        throw HttpError(404);
    }
    res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
    const result = await Contact.updateOne(
        {_id: req.params.id},
        req.body
    )

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
};

const updateStatusContact = async (req, res) => {
    const result = await Contact.updateOne(
        {_id: req.params.id},
        req.body
    )

    if (!result) {
        throw HttpError(404);
    }

    res.json(result);
}

module.exports = {
    getAllContacts: wrapper(getAllContacts),
    getOneContact: wrapper(getOneContact),
    createContact: wrapper(createContact),
    deleteContact: wrapper(deleteContact),
    updateContact: wrapper(updateContact),
    updateStatusContact: wrapper(updateStatusContact),
};
