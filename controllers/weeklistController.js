const jwt = require('jsonwebtoken');
const WeekList = require('../models/weeklistModel');

const isLoggedIn = (req, res, next) => {
    try {
        const { jwttoken } = req.headers;
        const user = jwt.verify(jwttoken, process.env.JWT);
        req.user = user;
        return next();
    } catch (error) {
        console.log(error);
        res.json({
            status: 'FAILED',
            message: "You've not logged in! Please login",
        });
        return;
    }
};

const createWeekList = async (req, res, next) => {
    try {
        const activeWeekList = await WeekList.find({
            userId: req.user.userId,
            completed: false,
        });
        if (activeWeekList.length >= 2) {
            return res.status(403).json({
                error:
                    'User can have only two active week lists at a time, complete previous one to create new weeklist',
            });
        }
        const { description, tasks } = req.body;
        const newWeekList = await WeekList.create({
            userId: req.user.userId,
            description,
            tasks,
            completed: false,
            weekListId: (await WeekList.countDocuments()) + 1,
            isActive: true,
            createdAt: Date.now(),
            updatedAt: null,
        });

        res.status(201).json({ newWeekList });
    } catch (err) {
        res.status(400).json({
            err: err.message,
        });
    }
};

const updateWeekList = async (req, res, next) => {
    try {
        const { id } = req.params;
        const weekList = await WeekList.findById(id);
        const currentWeekList = Date.now();
        const updateIn = currentWeekList - weekList.createdAt;

        if (updateIn > 24 * 60 * 60 * 1000) {
            res.status(400).json({
                error:
                    "you can update weeklist within 24 hours so 24hrs passed now you can't update the weeklist",
            });
        }
        const updateTime = (weekList.updatedAt = Date.now());
        const updateWeekList = await WeekList.findByIdandUpdate(id, {
            $set: req.body,
            updateTime,
        });
        res.status(200).json(updateWeekList);
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
};

const deleteWeekList = async (req, res) => {
    try {
        const { id } = req.params;
        const weekList = await WeekList.findById(id);
        const updateIn = currentWeekList - weekList.createdAt;

        if (updateIn > 24 * 60 * 60 * 1000) {
            res.status(400).json({
                error:
                    "you can update weeklist within 24 hours so 24hrs passed now you can't update the weeklist",
            });
        }
        const updateWeekList = await WeekList.findByIdAndDelete(id);
        res.status(200).json(updateWeekList);
    } catch (err) {
        res.status(400).json({
            error: err.message,
        });
    }
};
const getWeekLists = async (req, res) => {
    try {
        const weekList = await WeekList.find({ userId: req.user.userId });
        console.log(req.user.userId);
        res.json({ weekList });
    } catch (error) {
        res.status(400).json({
            error: error.message,
        });
    }
};

module.exports = {
    isLoggedIn,
    createWeekList,
    updateWeekList,
    deleteWeekList,
    getWeekLists,
};
