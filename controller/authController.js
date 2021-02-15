const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { issueJWT } = require("../utils/issueJWT");
const cloudinary = require('cloudinary').v2;

exports.signUp = (req, res) => {
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
        console.log(err);
        const error = new Error(err);
        error.httpStatusCode = 500;
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

exports.uploadUserImage = (req, res) => {
  const { image, userId } = req.body;
  User.findById(userId).then(user => {
    if(!user) {
      const error = new Error("User not found!");
      throw error;
    }
    const savedUser = cloudinary.uploader.upload(image, { folder: "korra" }, (err, result) => {
      if(result) {
        user.imageUrl = result.url;
        user.imageId = result.public_id;
      }
      return user.save();
    })
    return savedUser;
  })
  .then(savedUser => {
    // automatically log user in
    res.status(200).json({ user: savedUser, message: "Image uploaded successfully" });
  })
  .catch(err => {
    console.log(err);
  })
}

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let dbUser;
  User.findOne({ email: email })
    .then((user) => {     
        if (!user) {
            res.status(401).json({ message: "could not find user with this email" });
        }
        console.log(user)
        dbUser = user
        return bcrypt.compare(password, user.password)
    })
    .then(isEqual => {
        if (!isEqual) {
        res.status(401).json({ message: "Incorrect password" });
        }
        const tokenObject = issueJWT(dbUser);
        res.status(200).json({ token: tokenObject.token, expiresIn: tokenObject.expires });
    })
    .catch((err) => {   
      console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
}
