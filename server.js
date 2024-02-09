const mongoose = require("mongoose");
const app = require("./app.js");

const {DB_HOST, PORT} = process.env;

mongoose.connect(DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
            console.log("DB connection success");
            console.log("Server is running. Use our API on port: 3000");
        });
    })
    .catch(e => {
        console.log(e.message);
        process.exit(1);
    })