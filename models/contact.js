const {Schema, model} = require('mongoose');
const Joi = require('joi')
const {boolean} = require("joi");

const emailRegex = /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/;
const phoneRegex = /^380\d{9}$/;

const contactSchema =  new Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact']
    },
    email: {
        type: String,
        match: [emailRegex, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        match: [phoneRegex, 'Please fill a valid phone number']
    },
    favorite: {
         type: Boolean,
         default: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, {versionKey: false, timestamps: true});

const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email({minDomainSegments: 2}),
    phone: Joi.string().regex(phoneRegex),
    favorite: Joi.boolean()
})

const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(30),
    email: Joi.string().email({ minDomainSegments: 2 }),
    phone: Joi.string().regex(phoneRegex),
    favorite: Joi.boolean()
}).min(1).message("Body must have at least one field");

const updateContactFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
});

const joiSchemas = {
    createContactSchema: createContactSchema,
    updateContactSchema: updateContactSchema,
    updateContactFavoriteSchema: updateContactFavoriteSchema
}

contactSchema.post('save', (error, data, next)  => {
    error.status = 400;
    next();
})

 const Contact = model('contact', contactSchema);

 module.exports = {Contact, joiSchemas, emailRegex};