const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const appRoutes = require('./routes/appRoutes');
const authRoutes = require('./routes/authRoutes');

const keys = require('./config/keys');

const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    // res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

require('./models/Question');
require('./models/User');
require('./services/passport');

// app.use(passport.initialize());
// app.use(passport.session());

app.use(bodyParser.json()); // to parse incoming json data
app.use(bodyParser.urlencoded({ extended: true }));


app.use(appRoutes);
app.use(authRoutes);

app.get('/', (req, res) => {
    res.send("Welcome to Korra api")
})

app.use((error, req, res, next) => {
    console.log(error);
    res.status(error.httpStatusCode).json({ message: 'An error occured, please try again' })
})

mongoose.connect(keys.mongoURI).then(connect => {
    console.log('Database Connected!')
}).catch(err => console.log(err));

const PORT = process.env.PORT || 8000
app.listen(PORT)
