const Question = require('../models/Question');
const User = require('../models/User');

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
