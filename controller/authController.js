const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { issueJWT } = require("../utils/issueJWT");

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

exports.login = (req, res) => {
  const { email, password } = req.body;
  let dbUser;
  User.findOne({ email: email })
    .then((user) => {     
        if (!user) {
            res.status(401).json({ message: "could not find user with this email" });
        }
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
