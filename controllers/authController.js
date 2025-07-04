// controllers\authController.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const prisma = require("../db/prisma");
const passport = require("../config/passportConfig");
const { title } = require("process");
const { error } = require("console");

// GET /login
const loginGet = (req, res) => {
   res.render("auth/login", {
      user: req.user || null,
      title: "Login",
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};
// POST /login
const loginPost = (req, res, next) => {
   passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/auth/login",
      failureFlash: true,
      successFlash: "Successfully logged in",
   })(req, res, next);
};
// GET /register
const registerGet = (req, res) => {
   res.render("auth/register", {
      user: req.user || null,
      title: "Register",
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};

// POST /register
const registerPost = async (req, res) => {
   const { username, name, email, password } = req.body;

   try {
      // 1. check for existing user
      const existing = await prisma.user.findFirst({
         where: {
            OR: [{ username }, { email }],
         },
      });
      if (existing) {
         req.flash("error", "Username or email already taken!");
         return res.redirect("/auth/register");
      }

      // 2. Hash password
      const hashed = await bcrypt.hash(password, 11);

      // 3. createUser
      await prisma.user.create({
         data: {
            username,
            name,
            email,
            password_hash: hashed,
         },
      });

      req.flash("success", "Account created! Please log in");
      res.redirect("/auth/login");
   } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong. Please try again.");
      res.redirect("/auth/register");
   }
};

// /auth/forgot-password GET
const forgotPasswordGet = (req, res) => {
   res.render("auth/forgotPassword", {
      title: "Forgot Password",
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};

// /auth/forgot-password POST
const forgotPasswordPost = async (req, res) => {
   const { email } = req.body;

   try {
      const user = await prisma.user.findUnique({
         where: { email },
      });

      if (!user) {
         req.flash("error", "No account with that email found.");
         return res.redirect("/auth/forgot-password");
      }

      const token = crypto.randomBytes(20).toString("hex");
      const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.user.update({
         where: { email },
         data: {
            password_reset_token: token,
            password_reset_expires: expiration,
         },
      });

      // Simulate email send
      console.log(`Password reset link: http://localhost:5000/auth/reset-password/${token}`);

      req.flash("success", `Check your email for a reset link.\n Got to : auth/reset-password/${token}`);
      res.redirect("/auth/login");
   } catch (err) {
      console.error(err);
      req.flash("error", "An error occurred. Please Try again");
      res.redirect("/auth/forgot-password");
   }
};
// /auth/reset-password/:token GET
const resetPasswordGet = async (req, res) => {
   console.log('herererer21')
   const { token } = req.params;

   const user = await prisma.user.findFirst({
      where: {
         password_reset_token: token,
         password_reset_expires: {
            gte: new Date(),
         },
      },
   });

   if (!user) {
      req.flash("error", "Password reset token is invalid or has expired.");
      return res.redirect("/auth/forgot-password");
   }

   res.render("auth/resetPassword", {
      title: "Reset Password",
      token,
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};
// /auth/reset-password/:token POST
const resetPasswordPost = async (req, res) => {
   const { token } = req.params;
   const { password } = req.body;

   const user = await prisma.user.findFirst({
      where: {
         password_reset_token: token,
         password_reset_expires: {
            gte: new Date(),
         },
      },
   });

   if(!user) {
      req.flash('error', 'Password reset token is invalid or has expired.')
      return res.redirect('/auth/forgot-password')
   }

   const hashed = await bcrypt.hash(password, 11)

   await prisma.user.update({
      where: {id: user.id},
      data: {
         password_hash: hashed,
         password_reset_token:null,
         password_reset_expires: null,
      }
   })

   req.flash('success', 'Your password has been reset. Please log in')
   res.redirect('/auth/login')
};

const logoutGet = (req, res, next) => {
   console.log('loggin out')
   // Set a success flash assuming logout will succeed
   req.flash("success", "You have been logged out");

   req.logout((err) => {
      if (err) {
         console.error("Logout error:", err);
         // Flash an error message and redirect, session is probably still valid
         req.flash("error", "Failed to log out. Please try again.");
         return res.redirect("/");
      }

      req.session.destroy((err) => {
         if (err) {
            console.error("Session destroy error:", err);
            // Flash an error message and redirect, session might still be valid or partially destroyed
            req.flash("error", "Failed to log out properly. Please try again.");
            return res.redirect("/");
         }

         res.clearCookie("connect.sid");
         // Session is destroyed and cookie cleared; user is logged out
         res.redirect("/");
      });
   });
};

module.exports = {
   loginGet,
   loginPost,
   registerGet,
   registerPost,
   logoutGet,
   forgotPasswordGet,
   forgotPasswordPost,
   resetPasswordGet,
   resetPasswordPost,
};

// ✅ After password reset:
// req.flash('success', 'Your password has been reset');
// res.redirect('/login');

// ✅ After logout:
// req.flash('success', 'You have been logged out');
// res.redirect('/');

// // POST /logout
// exports.logoutPost = (req, res) => {
//   req.session.destroy(err => {
//     if (err) {
//       console.error(err);
//       return res.redirect('/');
//     }
//     res.clearCookie('connect.sid');
//     res.redirect('/');
//   });
// };

// // OPTIONAL: GET /forgot
// exports.forgotGet = (req, res) => {
//   res.render('forgot', { title: 'Forgot Password' });
// };

// // OPTIONAL: POST /forgot
// exports.forgotPost = async (req, res) => {
//   // TODO: Generate reset token and send email
//   res.render('forgot', { message: 'Password reset link sent' });
// };

// // OPTIONAL: GET /reset/:token
// exports.resetGet = async (req, res) => {
//   // TODO: Validate token and render reset form
//   res.render('reset', { token: req.params.token });
// };

// // OPTIONAL: POST /reset/:token
// exports.resetPost = async (req, res) => {
//   // TODO: Update user password based on token
//   res.redirect('/login');
// };
