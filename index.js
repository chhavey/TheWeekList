const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const userRoute = require('./routes/authRoutes');
const weeklistRoute = require('./routes/weeklistRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', userRoute);
app.use('/', weeklistRoute);


// Route not found middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: 'FAILED',
        message: 'Route not found.'
    });
});


app.get('/', (req, res) => {
    res.send('Welcome to the Week List.');
})

//health route
app.get('/health', (req, res) => {
    const currentTime = new Date().toLocaleString();
    try {
        res.json({
            serverName: "TheWeekList",
            time: currentTime,
            status: "Active",
        });
    } catch (error) {
        res.json({
            serverName: "TheWeekList",
            time: currentTime,
            status: "Inactive"
        })
    }

});

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running sucessfully on port ${process.env.PORT}.`))
        .catch((error) => console.log(error));
})