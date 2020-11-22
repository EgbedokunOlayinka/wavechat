module.exports = async function (req, res, proceed) {
  if (req.isAuthenticated()) {
    res.redirect("home");
  } else {
    return proceed();
  }
};
