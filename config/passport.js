const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passportField: "password",
    },
    function (email, password, cb) {
      Users.findOne({ email }, function (err, user) {
        if (err) return cb(err);
        if (!user)
          return cb(null, false, { message: "This email is not registered" });
        bcrypt.compare(password, user.password, function (err, res) {
          if (!res) return cb(null, false, { message: "Invalid Password" });
          return cb(null, user, { message: "Login Succesful" });
        });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Users.findOne({ id }, function (err, user) {
    done(err, user);
  });
});
