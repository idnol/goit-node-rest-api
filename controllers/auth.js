const HttpError = require("../helpers/HttpError");
const wrapper = require("../helpers/wrapper");
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const {SECRET} = process.env;

const register = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (user) {
        throw HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({...req.body, password: hashPassword});

    if (!result) {
        throw HttpError(404);
    }
    res.status(201).json(req.body);
}

const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        throw HttpError(401, 'Email or password is wrong');
    }

    const unHashPassword = await bcrypt.compare(password, user.password);

    if (!unHashPassword) {
        throw HttpError(401, 'Email or password is wrong');
    }
    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, SECRET, {expiresIn: '23h'})

    await User.findByIdAndUpdate(user._id, {token} )

    res.status(201).json(token);
}

module.exports = {
    register: wrapper(register),
    login: wrapper(login),
};