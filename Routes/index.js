//----------------------------------------------- Require Dependencies
const express = require('express');
const router = express.Router();
const {
    ensureAuthenticated
} = require('../Helpers/ensureAuthenticated');

//----------------------------------------------- Root Index Route
// Home Page
router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index');
});
// About Page
router.get('/about', (req, res) => {
    res.render('about');
});

//----------------------------------------------- Export Module
module.exports = router;