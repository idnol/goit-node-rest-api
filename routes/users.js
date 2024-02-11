const express = require('express');
const {getCurrentUser, logout} = require("../controllers/users");
const authenticate = require("../helpers/authenticate");


const usersRouter = express.Router();

usersRouter.get('/current', authenticate, getCurrentUser);
usersRouter.get('/logout', authenticate, logout);

module.exports = usersRouter;