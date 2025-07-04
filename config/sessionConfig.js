// config/sessionConfig.js

const sesion = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const prisma = require("../db/prisma");

const sessionMiddleware = sesion({
   secret: process.env.SESSION_SECRET || "dev_secret",
   resave: false,
   saveUninitialized: true,
   cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax", // CSRF protection
      secure: process.env.NODE_ENV === "production", // not able to have session in 'dev' mode only in 'prod' mode
   },
   store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // Clean up expired sessions every 2 minutes
      dbRecordIdIsSessionId: true, // Use session ID as the database record ID
      dbRecordIdFunction: undefined,
   }),
});
module.exports = sessionMiddleware;
// dbRecordIdIsSessionId:  A flag indicating to use the session ID as the Prisma Record ID

// dbRecordIdFunction:  A function to generate the Prisma Record ID for a given session ID
