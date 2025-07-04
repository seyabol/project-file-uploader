// middleware\ensureAdmin.js

function ensureAdmin(req, res, next) {
   if (req.isAuthenticated() && req.user.role === "ADMIN") return next();
   // Way 1: res.status(403).render('partials/errors', {message: 'Admin access only.'})
   // Way 2: Pass error to global handler
   next(new Error("Admin access only.")); // in this way status is not sent if you want to set it read comment
}

module.exports = ensureAdmin
/*
Way 3: 
==========================================
// errors/ForbiddenError.js
class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.status = 403;
  }
}
module.exports = ForbiddenError;
===========================================
In this file:

const ForbiddenError = require('../errors/ForbiddenError');

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'ADMIN') {
    return next();
  }
  return next(new ForbiddenError('Admin access only.'));
}

*/
