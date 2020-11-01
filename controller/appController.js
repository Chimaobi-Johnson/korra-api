const Question = require('../models/Question');
const User = require('../models/User');

exports.getUser = (req, res) => {
     console.log(req)
    res.status(200).json({user: req.user});
}

exports.getQuestions = (req, res) => {
    // Question.find();
    res.status(200).json({message: "good enough"});
}