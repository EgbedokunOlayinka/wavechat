/**
 * UsersController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const passport = require("passport");

module.exports = {
  register: async function (req, res) {
    try {
      let errors = [];

      let { password, password2, username, email, fullName } = req.body;

      // check for all inputs
      if (!password || !password2 || !username || !email || !fullName) {
        errors.push({ msg: "Please fill in all fields" });
      }

      // passwords not matching
      if (password !== password2) {
        errors.push({ msg: "Passwords do not match" });
      }

      // password not long enough
      if (password.length < 6) {
        errors.push({ msg: "Password length should be at least 6 characters" });
      }

      if (errors.length > 0) {
        return res.view("./pages/register", {
          errors,
          fullName,
          email,
          username,
          password,
          password2,
        });
      } else {
        // email to lowercase
        let newEmailAddress = email.toLowerCase();
        let newUsername = username.toLowerCase();

        // check if email exists
        const checkUserEmail = await Users.find({ email: newEmailAddress });
        if (checkUserEmail.length > 0) {
          errors.push({
            msg: "Email address already registered",
          });
        }

        // check if username exists
        const checkUsername = await Users.find({ username: req.body.username });
        if (checkUsername.length > 0) {
          errors.push({
            msg: "Username already taken. Please try a more unique one",
          });
        }

        if (errors.length > 0) {
          return res.view("./pages/register", {
            errors,
            fullName,
            email,
            username,
            password,
            password2,
          });
        }

        // create new user
        let newUser = await Users.create({
          fullName: fullName,
          email: newEmailAddress,
          password: password,
          username: newUsername,
        }).fetch();

        sails.sockets.blast("newUser", newUser);

        process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

        var nodemailer = require("nodemailer");

        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "egbedokunolayinka11@gmail.com",
            pass: "Frankenstein-1998",
          },
        });

        var mailOptions = {
          from: "egbedokunolayinka11@gmail.com",
          to: newUser.email,
          subject: "Sending Email using Node.js",
          text:
            "Welcome to Wavechat. You can now log in with the login details you provided.",
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });

        // return success message
        req.addFlash(
          "success",
          "Account created successfully. Check your email for a success message."
        );
        res.redirect("login");
      }
    } catch (err) {
      // error pageeeeeeeeeeeeee
      console.log(err);
      res.view("./pages/error");
    }
  },

  login: async function (req, res) {
    passport.authenticate("local", function (err, user, info) {
      let errors = [];
      if (err || !user) {
        errors.push({
          msg: "Invalid email and password combination",
        });
        return res.view("./pages/login", { errors });
      }

      req.login(user, function (err) {
        if (err) res.view("./pages/error");
        req.user = user;
        return res.redirect("home");
      });
    })(req, res);
  },
  logout: async function (req, res) {
    req.session.destroy(function () {
      return res.redirect("/");
    });
  },
  showWelcome: async function (req, res) {
    res.view("./pages/welcome");
  },
  showLogin: async function (req, res) {
    res.view("./pages/login");
  },
  showRegister: async function (req, res) {
    res.view("./pages/register");
  },
  showHome: async function (req, res) {
    res.view("./pages/landing");
  },
  createProfile: function (req, res) {
    let errors = [];

    let { fullName, bio, location } = req.body;

    // check for all inputs
    if (!fullName) {
      errors.push({ msg: "Please fill in all fields" });
      return res.view("./pages/profile", { errors });
    }

    req.file("image").upload(
      {
        dirname: "../../assets/images/",
        maxBytes: 10000000,
      },
      function (err, uploadedFiles) {
        if (err) {
          console.log(err);
          return res.view("./pages/error");
        }

        Users.findOne({ id: req.user.id })
          .then((currentUser) => {
            let imageFd = currentUser.imageFd;

            if (uploadedFiles.length > 0) {
              let f = uploadedFiles[0].fd;
              imageFd = f.replace(/^.*[\\\/]/, "");
            }

            Users.updateOne({ id: req.user.id })
              .set({
                fullName,
                bio: bio || currentUser.bio,
                location: location || currentUser.location,
                imageFd: imageFd || currentUser.imageFd,
              })
              .then(() => {
                req.addFlash("success", "Profile updated successfully");
                return res.redirect("home");
              })
              .catch((err) => {
                console.log(err);
                return res.view("./pages/error");
              });
          })
          .catch((err) => {
            console.log(err);
            return res.view("./pages/error");
          });
      }
    );
  },
  showProfile: async function (req, res) {
    try {
      const currentUser = await Users.findOne({ id: req.user.id });

      res.view("./pages/profile", {
        fullName: currentUser.fullName,
        bio: currentUser.bio,
        location: currentUser.location,
        imageFd: currentUser.imageFd,
      });
    } catch (err) {
      console.log(err);
      res.view("./pages/error");
    }
  },
  showChatPage: async function (req, res) {
    try {
      res.view("./pages/chat", { userId: req.user.id });
    } catch (err) {
      console.log(err);
      res.view("./pages/error");
    }
  },
  showChat: async function (req, res) {
    console.log(123);
  },

  sayHello: async function (req, res) {
    // if (!req.isSocket) {
    //   return res.badRequest();
    // }

    // Have the socket which made the request join the "funSockets" room.
    sails.sockets.join(req, "funSockets");

    // Broadcast a notification to all the sockets who have joined
    // the "funSockets" room, excluding our newly added socket:
    sails.sockets.broadcast("funSockets", "hello", { howdy: "hi there!" }, req);

    return res.json({
      anyData: "we want to send back",
    });
  },

  hello: async function (req, res) {
    res.view("./pages/hello");
  },

  sendMessage: async function (req, res) {
    try {
      const currentUser = await Users.findOne({ id: req.body.userId });

      console.log(currentUser);

      let newMessage = await ChatMessages.create({
        text: req.body.message,
        createdBy: currentUser.id,
      }).fetch();

      sails.sockets.blast("message", { newMessage, currentUser });

      res.ok();
    } catch (err) {
      console.log(err);
      res.view("./pages/error");
    }
  },
};
