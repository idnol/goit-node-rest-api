const HttpError = require("../helpers/HttpError");
const wrapper = require("../helpers/wrapper");
const {User} = require('../models/user');
require('dotenv').config();

const getCurrentUser = async (req, res) => {
    const {id: id} = req.user;
    const result = await User.findById(id);
    if (!result) {
        throw HttpError(404);
    }
    res.status(201).json(result);
}
const logout = async (req, res) => {
    const {id: id} = req.user;
    const result = await User.findByIdAndUpdate(id, {token: ''});
    if (!result) {
        throw HttpError(404);
    }
    res.status(201).json(result);
}

module.exports = {
    getCurrentUser: wrapper(getCurrentUser),
    logout: wrapper(logout)
};