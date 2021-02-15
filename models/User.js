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
    required: true
  },
  occupation: String,
  workplace: String,
  imageUrl: String,
  imageId: String,
  email: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  phone: String,
  country: String,
  profilePhoto: String,
  profilePhotoId: String,
  coverImage: String,
  coverImageId: String,
  password: String,
  role: { type: String, default: 'Suscriber' },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question'
    }
  ],
  groups: [String],
  interests: [String],
  friends: [ String ],
  answers: [
    {
			type: Schema.Types.ObjectId,
			ref: 'Answer'
		}
  ],
  address: {
    country: String,
    state: String,
    city: String,
    zip: Number,
  },
  // location: {
  //   type: GeolocationCoordinates
  // }
}, { timestamps: true });

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('user', userSchema);
