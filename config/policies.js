/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {
  UsersController: {
    register: "guest",
    login: "guest",
    logout: "guest",
    showWelcome: "guest",
    showRegister: "guest",
    showLogin: "guest",
    showHome: "authenticated",
    showProfile: "authenticated",
    createProfile: "authenticated",
    showChatPage: "authenticated",
    sendMessage: true,
    logout: true,
  },
};
