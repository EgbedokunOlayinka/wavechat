module.exports = async function (req, res, proceed) {
  if (req.isAuthenticated()) {
    return proceed();
  } else {
    res.redirect("/");
  }
};
