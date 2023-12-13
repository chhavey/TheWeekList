const express = require('express');
const {
    createWeekList,
    isLoggedIn,
    updateWeekList,
    deleteWeekList,
    getWeekLists,
} = require('../controllers/weeklistController');

const router = express.Router();
router.post('/weekList', isLoggedIn, createWeekList);

router.patch('/weekList/:id', isLoggedIn, updateWeekList);

router.delete('/weekList/:id', isLoggedIn, deleteWeekList);

router.get('/weekList', isLoggedIn, getWeekLists);

module.exports = router;
