const HttpError = require("../helpers/HttpError");
const wrapper = require("../helpers/wrapper");
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs');
const path = require("path");
const jimp = require("jimp");
require('dotenv').config();

const {SECRET} = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const {email, password} = req.body;

    const avatarURL = gravatar.url(email);

    console.log(avatarURL)

    const user = await User.findOne({email});

    if (user) {
        throw HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({...req.body, password: hashPassword, avatarURL: avatarURL});

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

const setAvatar = async (req, res) => {
    const {id: id} = req.user;
    const {path: tempUpload, originalname} = req.file;
    const filename = `${id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    (await jimp.read(tempUpload)).resize(360, 360).write(tempUpload);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join('avatars', filename);

    await User.findByIdAndUpdate(id, {avatarURL: avatarURL});

    res.json({avatarURL})
}

module.exports = {
    register: wrapper(register),
    login: wrapper(login),
    getCurrentUser: wrapper(getCurrentUser),
    logout: wrapper(logout),
    setAvatar: wrapper(setAvatar)
};