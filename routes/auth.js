const express = require('express');
const validateBody = require("../helpers/validateBody");
const {userSchemas} = require('../models/user');
const {register, login, getCurrentUser} = require('../controllers/auth');

const {registerSchema, loginSchema} = userSchemas;

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), register);
authRouter.post('/login', validateBody(loginSchema), login);

module.exports = authRouter;