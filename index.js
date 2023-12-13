const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const User = mongoose.model("User", {
    fullName: String,
    email: String,
    password: String,
    age: Number,
    gender: String,
    mobile: String,
});

//middleware
const isLoggedIn = (req, res, next) => {
    try {
        const { jwttoken } = req.headers
        const user = jwt.verify(jwttoken, process.env.JWT_SECRET)
        req.user = user
        next()
    }
    catch (error) {
        res.json({
            status: 'FAILED',
            message: 'Please Log in to continue'
        })
    }

}

// Route not found middleware
app.use((req, res, next) => {
    res.status(404).json({
        status: 'FAILED',
        message: 'Route not found'
    });
});


app.get('/', (req, res) => {
    res.send('Welcome to the Week List.');
})

//health route
app.get('/health', isLoggedIn, (req, res) => {
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

//login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email });
        if (user) {
            let passwordMatch = await bcrypt.compare(password, user.password);
            const jwttoken = jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: 3600 });
            if (passwordMatch) {
                res.json({
                    status: 'SUCCESS',
                    message: 'Logged In Successfully.',
                    jwttoken: jwttoken
                })
            }
            else {
                res.json({
                    status: 'FAILED',
                    message: 'Invalid Password'
                })
            }

        }
        else {
            res.json({
                status: 'FAILED',
                message: 'Invalid Email.'
            })
        }

    }
    catch (error) {
        res.json({
            status: 'FAILED',
            message: 'Invalid Login.'
        })
    }

})

//signup route
app.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, age, gender, mobile } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 12);
        await User.create({ fullName, email, password: encryptedPassword, age, gender, mobile });
        res.json({
            status: 'SUCCESS',
            message: 'Sign Up Successful.'
        });
    }
    catch (error) {
        res.json({
            status: 'FAILED',
            message: 'Something went wrong.'
        })
    }
})


app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running sucessfully on port ${process.env.PORT}.`))
        .catch((error) => console.log(error));
})