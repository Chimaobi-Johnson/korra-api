const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { issueJWT } = require("../utils/issueJWT");
const cloudinary = require('cloudinary').v2;

require('../config/cloudinary');

exports.signUp = (req, res, next) => {
  const { firstName, lastName, email, gender, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        firstName,
        lastName,
        email,
        gender,
        password: hashedPw,
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ message: "User created successfully", user: result });
    })
    .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = err.response.status;
        return next(error);
    });
};


exports.addUserDetails = (req, res) => {
  const { phone, country, groups, interests, userId } = req.body;
  User.findById(userId).then(user => {
    if(!user) {
      const error = new Error("User not found!");
      throw error;
    }
    user.phone = phone;
    user.country = country;
    user.groups = groups;
    user.interests = interests;
    return user.save();
  })
  .then(savedUser => {
    // automatically log user in
    const tokenObject = issueJWT(savedUser);
    res.status(200).json({ token: tokenObject.token, expiresIn: tokenObject.expires });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.uploadUserImage = (req, res, next) => {
  const { profilePic, userId } = req.body;
  User.findById(userId).then(user => {
    if(!user) {
      const error = new Error("User not found!");
      error.httpStatusCode = 404;
      return next(error);
    }
    const savedUser = cloudinary.uploader.upload(profilePic, { folder: "korra" }, (err, result) => {
      if(result) {
        user.profilePhoto = result.url;
        user.profilePhotoId = result.public_id;
      }
      return user.save();
    })
    return savedUser;
  })
  .then(savedUser => {
    res.status(200).json({ user: savedUser, message: "Image uploaded successfully" });
  })
  .catch(err => {
    console.log(err);
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
}

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let dbUser;
  User.findOne({ email: email })
    .then((user) => {     
        if (!user) {
            const error = new Error("A user with this email could not be found!");
            error.httpStatusCode = 404;
            return next(error);
        }
        dbUser = user
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
        if (!isEqual) {
          const error = new Error("Error. Email or password is not correct");
          error.httpStatusCode = 401;
          return next(error);
        }
        const tokenObject = issueJWT(dbUser);
        res.status(200).json({ token: tokenObject.token, expiresIn: tokenObject.expires });
    })
    .catch((err) => {   
      const error = new Error(err);
      error.httpStatusCode = err.response.status;
      return next(error);
    });
}
