/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  /***************************************************************************
   *                                                                          *
   * Make the view located at `views/homepage.ejs` your home page.            *
   *                                                                          *
   * (Alternatively, remove this and add an `index.html` file in your         *
   * `assets` directory)                                                      *
   *                                                                          *
   ***************************************************************************/

  "GET /": { controller: "UsersController", action: "showWelcome" },
  "GET /login": { controller: "UsersController", action: "showLogin" },
  "POST /login": { controller: "UsersController", action: "login" },
  "GET /register": { controller: "UsersController", action: "showRegister" },
  "POST /register": { controller: "UsersController", action: "register" },
  "GET /home": { controller: "UsersController", action: "showHome" },
  "GET /logout": { controller: "UsersController", action: "logout" },
  "GET /error": { view: "pages/error" },
  "GET /profile": {
    controller: "UsersController",
    action: "showProfile",
  },
  "POST /profile": {
    controller: "UsersController",
    action: "createProfile",
  },
  "GET /chat": {
    controller: "UsersController",
    action: "showChatPage",
  },
  "POST /send": {
    controller: "UsersController",
    action: "sendMessage",
  },

  /***************************************************************************
   *                                                                          *
   * More custom routes here...                                               *
   * (See https://sailsjs.com/config/routes for examples.)                    *
   *                                                                          *
   * If a request to a URL doesn't match any of the routes in this file, it   *
   * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
   * not match any of those, it is matched against static assets.             *
   *                                                                          *
   ***************************************************************************/
};
