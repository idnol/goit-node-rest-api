const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const contactsRouter = require('./routes/contactsRouter');
const dotenv = require('dotenv');
const authRouter = require('./routes/auth');
const usersRouter = require("./routes/users");

dotenv.config();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use("/api/contacts", contactsRouter);
app.use("/api/contacts/:id", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;