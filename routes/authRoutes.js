const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const app = express();

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

//Protected routes
app.get('/dashboard', isLoggedIn, async (req, res) => {
    res.send('Welocme to health dashboard page.');
});

//Signup route
app.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, age, gender, mobile } = req.body;
        const encryptedPassword = await bcrypt.hash(password, 12);
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            await User.create({ fullName, email, password: encryptedPassword, age, gender, mobile });
            res.json({
                status: 'SUCCESS',
                message: 'Sign Up Successful.'
            });
        }
        else {
            res.json({
                status: 'FAILED',
                message: 'User already exists.'
            })
        }

    }
    catch (error) {
        res.json({
            status: 'FAILED',
            message: 'Something went wrong.'
        })
    }
});

//Login route
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

});

module.exports = app;