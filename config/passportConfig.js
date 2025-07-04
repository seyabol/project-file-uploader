// config\passportConfig.js

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const prisma = require("../db/prisma");

const verifyCallback = async (username, password, done) => {
   try {
      // Find user by username
      const user = await prisma.user.findUnique({ where: { username } });

      // If no user is found, return false with no error
      if (!user) {
         return done(null, false, { message: "incorrect username" });
      }

      // Compare provided password with stored hashed password
      const isMatch = await bcrypt.compare(password, user.password_hash);

      // If passwords don't match, return false with no error
      if (!isMatch) {
         return done(null, false, { message: "Incorrect password" });
      }

      // If everything is correct, return the user
      return done(null, user);
   } catch (error) {
      // Hanldle any erros (e.g., database  issues)
      return done(error);
   }
};

// Configure Passport LocalStrategy
passport.use(new LocalStrategy(verifyCallback));

// Serialize User (store user ID in session)
passport.serializeUser((user, done) => {
   done(null, user.id);
});

// Deserialize User (retrieve user from database using ID)
passport.deserializeUser(async (id, done) => {
   try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
         return done(null, false); // no user founded with provided ID
      }
      return done(null, user);
   } catch (error) {
      return done(error);
   }
});

module.exports = passport;
