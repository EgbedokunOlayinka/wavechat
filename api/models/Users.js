/**
 * User.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const bcrypt = require("bcrypt-nodejs");

module.exports = {
  tableName: "users",
  attributes: {
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
    },
    password: {
      type: "string",
      required: true,
    },
    bio: {
      type: "string",
      defaultsTo: "",
    },
    location: {
      type: "string",
      defaultsTo: "",
    },
    imageFd: {
      type: "string",
      defaultsTo: "user-alt-solid.svg",
    },
  },
  customToJSON: function () {
    // omit password when retrieving record
    return _.omit(this, ["password"]);
  },
  beforeCreate: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, null, function (err, hash) {
        if (err) return cb(err);
        user.password = hash;
        return cb();
      });
    });
  },
};
