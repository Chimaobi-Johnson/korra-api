const { ObjectId } = require('bson');
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
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
        type: String
    },
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

questionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('question', questionSchema);
