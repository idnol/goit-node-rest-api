const fs = require('fs/promises');
const path = require("path");

const contactsPath = path.join(__dirname, "db/contacts.json");

async function listContacts() {
    const data =  await fs.readFile(contactsPath);
    return JSON.parse(data);
}

async function getContactById(contactId) {
    const data = await listContacts();
    const result = data.filter(item => item.id === contactId);
    return result || null;
}

async function removeContact(contactId) {
    const data = await listContacts();
    const index = data.findIndex(item => item.id === contactId);
    if (index === -1) {
        return null;
    }
    const result = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return result;
}

async function addContact(name, email, phone) {
    const data = await listContacts();
    const id = Date.now() + Math.random();
    const newContact = {
        id: id.toString(),
        name: name,
        email: email,
        phone: phone
    }
    data.push(newContact)
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return newContact;
}

module.exports = {listContacts, getContactById, removeContact, addContact}

