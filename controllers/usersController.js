const HttpError = require("../helpers/HttpError");
const wrapper = require("../helpers/wrapper");
const {User} = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs');
const path = require("path");
const jimp = require("jimp");

const sendEmail = require('../helpers/sendEmail');
const uniqid = require('uniqid');
require('dotenv').config();

const {SECRET} = process.env;

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
    const {email, password} = req.body;

    const avatarURL = gravatar.url(email);

    const verificationToken = uniqid();

    const user = await User.findOne({email});

    if (user) {
        throw HttpError(409, 'Email already in use');
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({...req.body, password: hashPassword, avatarURL: avatarURL, verificationToken: verificationToken});

    if (!result) {
        throw HttpError(404);
    }

    const verificationEmail = {
        to: email,
        subject: 'Verification email',
        html: `<a href="${process.env.HOST}/api/users/verify/${verificationToken}" target="_blank ">Click for verification</a>`
    }

    await sendEmail(verificationEmail);

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

    if(!user.verify) {
        throw HttpError(401, 'Verification has been required');
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
    (await jimp.read(tempUpload)).resize(250, 250).write(tempUpload);
    await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join('avatars', filename);

    await User.findByIdAndUpdate(id, {avatarURL: avatarURL});

    res.json({avatarURL})
}

const verifyEmail = async (req, res) => {
    const {verificationToken} = req.params ;
    const user = await User.findOne({verificationToken});

    if (!user) {
        throw HttpError(404, 'User not found');
    }

    await User.findByIdAndUpdate(user._id,{verify: true, verificationToken: ''});
    res.status(200).json('Verification successful')
}

const resendVerifyEmail = async (req, res) => {
    const {email} = req.body;
    if (!email) {
        throw HttpError(400, 'missing required field email');
    }

    const user = await User.findOne({email});

    if (!user) {
        throw HttpError(404, 'User not found');
    }

    if (user.verify) {
        throw HttpError(400, 'Verification has already been passed');
    }

    const verificationEmail = {
        to: email,
        subject: 'Verification email',
        html: `<a href="${process.env.HOST}/api/users/verify/${user.verificationToken}" target="_blank ">Click for verification</a>`
    }

    await sendEmail(verificationEmail);

    res.status(200).json('Verification email sent');

}

module.exports = {
    register: wrapper(register),
    login: wrapper(login),
    getCurrentUser: wrapper(getCurrentUser),
    logout: wrapper(logout),
    setAvatar: wrapper(setAvatar),
    verifyEmail: wrapper(verifyEmail),
    resendVerifyEmail: wrapper(resendVerifyEmail)
};