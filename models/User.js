const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const { Schema } = mongoose;

// implement role based access control from db first and reference to role doc

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    default: 'female'
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  profilePhoto: String,
  profilePhoto_id: String,
  coverImage: String,
  password: String,
  role: { type: String, default: 'Suscriber' },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }
  ],
  friends: [ String ],
  answers: [
    {
			type: Schema.Types.ObjectId,
			ref: 'Answer'
		}
  ]
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
