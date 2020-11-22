module.exports = {
  friendlyName: "Register",

  description: "Register user.",

  inputs: {
    fullName: {
      type: "string",
      required: true,
    },
    username: {
      type: "string",
      required: true,
      unique: true,
    },
    email: {
      type: "string",
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: "string",
      required: true,
      minLength: 6,
    },
    password2: {
      type: "string",
      required: true,
      minLength: 6,
    },
  },

  exits: {
    success: {
      statusCode: 201,
      description: "New user created",
    },
    emailAlreadyInUse: {
      statusCode: 400,
      description: "Email address already in use",
    },
    usernameAlreadyInUse: {
      statusCode: 400,
      description: "Username already in use",
    },
    passwordsNotMatching: {
      statusCode: 400,
      description: "Passwords do not match",
    },
    passwordNotLongEnough: {
      statusCode: 400,
      description: "Password length must be at least 6 characters",
    },
    allFieldsRequired: {
      statusCode: 400,
      description: "Please fill in all fields",
    },
    error: {
      description: "Something went wrong",
    },
  },

  fn: async function (inputs, exits) {
    try {
      // check for all inputs
      if (
        !inputs.password ||
        !inputs.password ||
        !inputs.username ||
        !inputs.email ||
        !inputs.fullName
      ) {
        return exits.allFieldsRequired({
          error: "Please fill in all fields",
        });
      }

      // password not matching
      if (inputs.password !== inputs.password2) {
        return exits.passwordsNotMatching({
          error: "Passwords do not match",
        });
      }

      // password not long enough
      if (inputs.password.length < 6) {
        return exits.passwordNotLongEnough({
          error: "Password length must be at least 6 characters",
        });
      }

      // email to lowercase
      let newEmailAddress = inputs.email.toLowerCase();

      // check if email exists
      const checkUserEmail = await User.find({ email: newEmailAddress });
      if (checkUserEmail.length > 0) {
        return exits.emailAlreadyInUse({
          error: "Email address already registered",
        });
      }

      // check if username exists
      const checkUsername = await User.find({ username: inputs.username });
      if (checkUsername.length > 0) {
        return exits.usernameAlreadyInUse({
          error: "Username already taken. Please try a more unique one",
        });
      }

      // if (errors.length > 0) {
      //   res.render("register", {
      //     errors,
      //     name,
      //     email,
      //     password,
      //     password2,
      //   });

      // create new user
      let newUser = await User.create({
        fullName: inputs.fullName,
        email: newEmailAddress,
        password: inputs.password,
        username: inputs.username,
      }).fetch();

      // send email
      // const email = {
      //   to: newUser.email,
      //   subject: "Registration Successful!",
      //   template: "success",
      //   context: {
      //     name: newUser.fullName,
      //     username: newUser.username,
      //     password: newUser.password,
      //   },
      // };
      // await sails.helpers.sendMail(email);

      // return success message
      return exits.success({
        message: `Account created successfully. Check your email for a success message and your login details`,
        data: newUser,
      });
    } catch (err) {
      return exits.error({
        message: "Something went wrong. Please try again",
        error: err.message,
      });
    }
  },
};
