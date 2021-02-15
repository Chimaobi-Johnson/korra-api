const mongoose = require("mongoose");
const Question = require('../models/Question');
const Answer = require('../models/Answer');

const User = require('../models/User');

const ObjectId = mongoose.Types.ObjectId;

exports.getUser = (req, res) => {
   res.status(200).json({user: req.user});
}

exports.getQuestions = (req, res) => {
    Question.aggregate([
      { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' }},
      { $lookup: { from: 'answers', localField: 'answers', foreignField: '_id', as: 'answers' }},
      { $lookup: { from: 'users', localField: 'upvotes', foreignField: '_id', as: 'upvotes' }},
      { $lookup: { from: 'users', localField: 'downvotes', foreignField: '_id', as: 'downvotes' }},
      { $lookup: { from: 'users', localField: 'shares', foreignField: '_id', as: 'shares' }},
      { $project: {
        title: 1,
        description: 1,
        topic: 1,
        upvotes: '$upvotes',
        downvotes: '$downvotes',
        shares: '$shares',
        tags: 1,
        createdAt: 1,
        answers: '$answers',
        userDetails: {
          userImage: '$createdBy.profilePhoto',
          userEmail: '$createdBy.email',
          firstName: '$createdBy.firstName',
          lastName: '$createdBy.lastName',
          country: '$createdBy.address.country',
          state: '$createdBy.address.state',
        }
  
       }}
    ])
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

// {{ ANSWERS }}

exports.addAnswer = (req, res) => {
  const { text, questionId, userId } = req.body;
  let answerId;
    const answer = new Answer({
      content: text,
      questionId: questionId,
      createdBy: userId
    })
    answer.save()
    .then(result => {
      answerId = result._id;
      return Question.findById(questionId)
    })
    .then(question => {
      if(!question) {
        const error = new Error("Question not found. Might have been deleted");
        throw error
      }
      question.answers.push(answerId);
      return question.save();
    })
    .then(updatedQuestion => {
        res.status(200).json({message: "Answer added successfully"});
    })
    .catch(err => {
      console.log(err)
    })

}


exports.getMainAnswer = (req, res) => {
  const { questionId } = req.body;
  Answer.find({ questionId: questionId })
  .sort({ "upvotes.length": 1 })
  .then(answers => {
    res.status(200).json({ answer: answers[0] });
  })
  .catch(err => {
    console.log(err)
  })

}


exports.getAnswers = (req, res) => {
  const { questionId } = req.body;
  Answer.aggregate([
    { $match: { questionId: ObjectId(questionId) } },
    { $lookup: { from: 'users', localField: 'createdBy', foreignField: '_id', as: 'createdBy' }},
    { $lookup: { from: 'comments', localField: 'comments', foreignField: '_id', as: 'comments' }},
    { $lookup: { from: 'users', localField: 'upvotes', foreignField: '_id', as: 'upvotes' }},
    { $lookup: { from: 'users', localField: 'downvotes', foreignField: '_id', as: 'downvotes' }},
    { $lookup: { from: 'users', localField: 'shares', foreignField: '_id', as: 'shares' }},
    { $project: {
      content: 1,
      upvotes: '$upvotes',
      downvotes: '$downvotes',
      shares: '$shares',
      images: 1,
      createdAt: 1,
      comments: '$comments',
      userDetails: {
        userImage: '$createdBy.profilePhoto',
        userEmail: '$createdBy.email',
        occupation: '$createdBy.occupation',
        workplace: '$createdBy.workplace',
        firstName: '$createdBy.firstName',
        lastName: '$createdBy.lastName',
        country: '$createdBy.address.country',
        state: '$createdBy.address.state',
      }

     }}
  ])
  .then(answers => {
    res.status(200).json({ answers });
  })
  .catch(err => {
    console.log(err)
  })

}

exports.upvoteQuestion = (req, res, next) => {
  const { userId, questionId } = req.body;
  Question.findById(questionId)
  .then(question => {
    if(!question) {
      const error = new Error("Question not found. Might have been deleted");
      throw error
    }
    // check is id exists, if it does remove it
    const isInArray = question.upvotes.includes(userId);
    if(isInArray) {
      const idIndex = question.upvotes.indexOf(userId);
      if (idIndex > -1) {
        question.upvotes.splice(idIndex, 1);
      }
    } else {
      question.upvotes.push(userId)
    }
    
    return question.save();
  })
  .then(updatedQuestion => {
    res.status(200).json({ question: updatedQuestion });
  }).catch(err => {
    console.log(err);
  })
}

