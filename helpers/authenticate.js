const HttpError = require("./HttpError");
const jwt = require('jsonwebtoken');
const {User} = require("../models/user");
require('dotenv').config();

const {SECRET} = process.env;
const authenticate = async (req, res, next) => {
    const {authorization = ''} = req.headers;
    const [bearer, token] = authorization.split(' ');

    if (bearer !== 'Bearer') {
        next(HttpError(401));
    }

    try {
        const {id} = jwt.verify(token, SECRET);
        const user = await User.findById(id);
        if (!user) {
            next(HttpError(401));
        }
        req.user = user;
        next();
    } catch (e) {
        next(HttpError(401));
    }
}

module.exports = authenticate;