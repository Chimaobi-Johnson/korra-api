const express = require('express');
const passport = require('passport');

const authController = require('../controller/authController');

const router = express.Router();

router.post('/auth/login', authController.login);

router.post('/auth/register', authController.signUp);

router.post('/auth/register/details', authController.addUserDetails);

router.get('/auth/logout', (req, res) => {
    req.logout();
    res.status(200).json({ message: 'User logged out' })
  })

// router.get('/user',  passport.authenticate('jwt', { session: false }), authController.getUser);


module.exports = router;

