const express = require('express');
const validateBody = require("../helpers/validateBody");
const {userSchemas} = require('../models/user');
const {register, login, getCurrentUser, logout} = require('../controllers/usersController');
const authenticate = require("../helpers/authenticate");

const {registerSchema, loginSchema} = userSchemas;

const usersRouter = express.Router();

usersRouter.post('/register', validateBody(registerSchema), register);
usersRouter.post('/login', validateBody(loginSchema), login);
usersRouter.get('/current', authenticate, getCurrentUser);
usersRouter.get('/logout', authenticate, logout);

module.exports = usersRouter;