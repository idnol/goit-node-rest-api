const {model, Schema} = require('mongoose');
const Joi = require('joi')

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
        minlength: 6
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: emailRegex
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: ''
    },
    avatarURL: String,
}, {versionKey: false, timestamps: true});

const registerSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valid("starter", "pro", "business"),
    avatarURL: Joi.string(),
})

const loginSchema = Joi.object({
    email: Joi.string().pattern(emailRegex).required(),
    password: Joi.string().min(6).required()
})

const userSchemas = {
    registerSchema: registerSchema,
    loginSchema: loginSchema
};

userSchema.post('save', (error, data, next)  => {
    const {name, code} = error;
    const status = (name === 'MongoServerError' && code === 11000) ? 409 : 400;
    error.status = status;
    next();
})

const User = model('user', userSchema);

module.exports = {User, userSchemas};