const { ObjectId } = require('bson');
const mongoose = require('mongoose')
const { Schema } = mongoose;

const questionSchema = new Schema({
    title: {
        required: true,
        type: String
    },
    description: {
        type: String
    },
    topic: {
        type: String,
    },
    upvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    downvotes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    shares: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    tags: [
      String
    ],
    answers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Answer'
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('question', questionSchema);
