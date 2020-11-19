const express = require('express');
const passport = require('passport');

const authController = require('../controller/authController');

const router = express.Router();

router.post('/auth/login', authController.login);

router.post('/auth/register', authController.signUp);

router.post('/auth/register/details', authController.addUserDetails);

// router.get('/user',  passport.authenticate('jwt', { session: false }), authController.getUser);


module.exports = router;

