const mongoose = require('mongoose')
const { Schema } = mongoose;

const answerSchema = new Schema({
    content: {
        required: true,
        type: String
    },
    images: [
        String
    ],
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
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    questionId: {
            type: Schema.Types.ObjectId,
            ref: 'Question',
            required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('answer', answerSchema);
