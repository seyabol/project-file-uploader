// controllers/homeController.js
const homeGet = (req, res) => {
   res.render("home", {
      title: "Welcome to My App",
      user: req.user || null,
      error: req.flash("error")[0] || null,
      success: req.flash("success")[0] || null,
   });
};

module.exports = {
   homeGet,
};

// exports.homeGet = (req, res) => {
//   res.render('home', { title: 'Welcome to My App', user: req.user || null });
// };

// exports.aboutGet = (req, res) => {
//   res.render('about', { title: 'About Us' });
// };

// exports.contactGet = (req, res) => {
//   res.render('contact', { title: 'Contact Us' });
// };

// exports.contactPost = (req, res) => {
//   const { name, email, message } = req.body;

//   // TODO: Save to database or send email

//   res.render('contact', {
//     title: 'Contact Us',
//     message: 'Thank you for reaching out!',
//     success: true,
//   });
// };

// exports.notFound = (req, res) => {
//   res.status(404).render('404', { title: 'Page Not Found' });
// };
