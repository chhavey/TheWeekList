const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Week List.');
})

app.listen(process.env.PORT, () => {
    console.log(`Server running sucessfully on port ${process.env.PORT}.`);
})