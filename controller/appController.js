const Question = require('../models/Question');
const User = require('../models/User');

exports.getUser = (req, res) => {
   res.status(200).json({user: req.user});
}

exports.getQuestions = (req, res) => {
    Question.find()
    .then(questions => {
      res.status(200).json({ questions });
    })
    .catch(err => {
      console.log(err)
    })

}

exports.addQuestion = (req, res) => {
  const { text, tags, category, userId } = req.body;
    const question = new Question({
      title: text,
      tags: tags,
      topic: category,
      createdBy: userId
    })
    question.save()
    .then(success => {
        res.status(200).json({message: "Question added successfully"});
    })
    .catch(err => {
      console.log(err)
    })

}
