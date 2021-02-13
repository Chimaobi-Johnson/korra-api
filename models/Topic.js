const mongoose = require('mongoose')
const { Schema } = mongoose;

const topicSchema = new Schema({
    Name: {
        required: true,
        type: String
    },
    followers: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    image: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('topic', topicSchema);
