const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobile: {
        type: Number,
        required: true
    },
    weekLists: [
        {
            description: String,
            startDate: { type: Date, default: Date.now() },
            endDate: {
                type: Date,
                default: () => {
                    const date = new Date();
                    date.setDate(date.getDate() + 7);
                    return date;
                },
            },
            status: {
                type: String,
                enum: ['active', 'completed', 'inactive'],
                default: 'active',
            },
            createdAt: { type: Date, default: Date.now() },
        },
    ],
});

const userModel = new mongoose.model('User', userSchema);
module.exports = userModel;
