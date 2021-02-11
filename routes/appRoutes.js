const express = require('express');
const passport = require('passport');

const appController = require('../controller/appController');

const router = express.Router();

router.get('/questions', appController.getQuestions);

router.post('/question', appController.addQuestion);

router.get('/user', passport.authenticate('jwt', { session: false }), appController.getUser);

// router.post('/api/question/new', appController.postQuestion);

// router.get('/api/answers', appController.getAnswers);

module.exports = router;
