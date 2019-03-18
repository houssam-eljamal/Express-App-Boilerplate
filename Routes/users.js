//----------------------------------------------- Require Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const {
  ensureGuest
} = require('../Helpers/ensureAuthenticated');
//----------------------------------------------- Load User Model
require('../Models/User');
const User = mongoose.model('users');

//----------------------------------------------- Routes
//----------------------------------------------- Login
// User Login Route
router.get('/login', ensureGuest, (req, res) => {
  res.render('users/login');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//----------------------------------------------- Register
// User Register Route
router.get('/register', ensureGuest, (req, res) => {
  res.render('users/register');
});

// Register Form POST
router.post('/register', (req, res) => {
  let errors = [];
  const {
    name,
    email,
    password,
    password2
  } = req.body;

  if (!name || !email || !password || !password2) {
    errors.push({
      text: 'All Forms are Required'
    })
  }
  if (password != password2) {
    errors.push({
      text: 'Passwords do not Match'
    });
  }
  if (password.length < 4) {
    errors.push({
      text: 'Password must be at least 4 characters'
    });
  }
  if (errors.length > 0) {
    res.render('users/register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
        email: email
      })
      .then(user => {
        if (user) {
          req.flash('error_msg', 'Email is already regsitered');
          res.redirect('/users/register');
        } else {
          const newUser = new User({
            name: name,
            email: email,
            password: password
          });
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser.save()
                .then(user => {
                  req.flash('success_msg', 'You are now registered and can log in');
                  res.redirect('/users/login');
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
  }
});

//----------------------------------------------- Logout
// Logout User
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

//----------------------------------------------- Export Module
module.exports = router;