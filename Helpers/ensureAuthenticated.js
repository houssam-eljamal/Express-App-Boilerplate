module.exports = {
  // If the User Not Loged in cant go to the like with ensureAuthenticated
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Please Login');
    res.redirect('/users/login');
  },

  // If the User is Loged in cant go to the like with ensureGuest
  ensureGuest: function (req, res, next) {
    if (req.isAuthenticated()) {
      res.redirect('/');
    } else {
      return next();
    }
  }
}