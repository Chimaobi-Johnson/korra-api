const mongoose = require('mongoose')
const { Schema } = mongoose;

const replySchema = new Schema({
    content: {
        required: true,
        type: String
    },
    like: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislike: [
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
    answer: {
            type: Schema.Types.ObjectId,
            ref: 'Answer',
            required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('reply', replySchema);
