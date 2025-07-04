// middleware\ensureAuthenticated.js

function ensureAuthenticated(req, res, next) {
   if (req.isAuthenticated()) return next();
   req.flash("error", "Authenticate yourself");
   res.redirect("/auth/login");
}

module.exports = ensureAuthenticated
