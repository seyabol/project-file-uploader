const express = require("express");
const path = require("path");

// session setup
const sessionMiddleware = require("./config/sessionConfig");

// Passport : loads strategy
const passport = require("./config/passportConfig");

// Flash
const flash = require("connect-flash");

// Routes
const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const folderRoutes = require("./routes/folderRoutes");
const fileRoutes = require("./routes/fileRoutes");

// App
const app = express();

// Setting View Engines
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files + Req.body
const staticPath = path.join(__dirname, "public");
app.use(express.static(staticPath));
app.use(express.urlencoded({ extended: true })); // req.body

// 🔐 Session + Passport
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session()); // to stay logged in across pages.

// ⚡ Flash : res.redirect() doesn’t pass res.locals or req.body => So we use flash to  persist messages across redirects.
app.use(flash());

// 🧪 Debug
app.use((req, res, next) => {
   console.log("SESSION:", req.session || "Nothing");
   console.log("-------------------------------");
   console.log("USER:", req.user || "<Nothing>");
   console.log("-------------- END ------------");
   next();
});

// Routing
app.get("/test", (req, res) => res.send("OK"));
app.use("/dashboard", folderRoutes);
app.use("/file", fileRoutes);
app.use("/", homeRoutes); // Home page

app.use("/auth", authRoutes); // Login, register
// 404 handler (after all routes)
app.use((req, res, next) => {
   console.log("Page not found.");
   res.status(404).render("partials/errors", { message: ["Page not found."] });
});

// Global error-handling middleware => gets called with next(err OR new Error('<Something broke>')) OR error happens inside a **sync** middleware or route handler

app.use((err, req, res, next) => {
   console.log("Global Error is Running Again :)");
   const status = err.status || 500;
   res.status(status).render("partials/errors", {
      message: err.message || "Something went wrong.",
   });
});

// Server Initialization
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
   console.log(`Server is running on http://localhost:${PORT}`);
});
