//----------------------------------------------- Require Dependencies
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//----------------------------------------------- Load user model
const User = mongoose.model('users');

//----------------------------------------------- Export Strategy
module.exports = function (passport) {
  passport.use(new LocalStrategy({
    // The usernameField is only required if we are using email as username
    usernameField: 'email'
  }, (email, password, done) => {
    // Match user
    User.findOne({
      email: email
    }).then(user => {
      // If no user found
      if (!user) {
        return done(null, false, {
          message: 'User Not Found'
        });
      }

      // If user is found
      // Match password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, {
            message: 'Password Incorrect'
          });
        }
      })
    })
  }));

  // In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}