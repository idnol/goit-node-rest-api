const express = require('express');
const validateBody = require("../helpers/validateBody");
const {userSchemas} = require('../models/user');
const {register, login, getCurrentUser, logout, setAvatar} = require('../controllers/usersController');
const authenticate = require("../helpers/authenticate");
const upload = require('../helpers/upload');

const {registerSchema, loginSchema} = userSchemas;

const usersRouter = express.Router();

usersRouter.post('/register', validateBody(registerSchema), register);
usersRouter.post('/login', validateBody(loginSchema), login);
usersRouter.get('/current', authenticate, getCurrentUser);
usersRouter.get('/logout', authenticate, logout);
usersRouter.patch('/avatar', authenticate, upload.single('avatar'), setAvatar);

module.exports = usersRouter;