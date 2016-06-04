const express = require('express');
const User = require(__dirname + '/../nodecellar/models/user.js');
const bodyParser = require('body-parser').json();
const basicHTTP = require(__dirname + '/../nodecellar/app/js/lib/basic_http.js');

var router = module.exports = exports = express.Router();

router.post('/signup', bodyParser, (req, res) => {
  var password = req.body.password;
  req.body.password = null;

  if (!password) return res.status(500).json({ msg: 'Please include a password' });

  var newUser = new User(req.body);
  newUser.generateHash(password);
  password = null;

  newUser.save((err, user) => {
    console.log(err);
    if (err) return res.status(500).json({ msg: 'Invalid username' });

    user.generateToken(function(err, token) {
      if (err) return res.status(500).json({ msg: 'could not generate token' });
      res.json({ token });
    });
  });
});

router.get('/signin', basicHTTP, (req, res) => {
  User.findOne({ username: req.auth.username }, (err, user) => {
    if (err) res.status(500).json({ msg: 'could not authenticate' });

    if (!user) return res.status(500).json({ msg: 'could not authenticate' });

    if (!user.compareHash(req.auth.password)) {
      return res.status(500)
      .json({ msg: 'could not authenticate' });
    }
    user.generateToken(function(err, token) {
      if (err) return res.status(500).json({ msg: 'could not generate token' });
      res.json({ token });
    });
  });
});
