// routes\authRoutes.js
const { Router } = require("express");
const authController = require("../controllers/authController");

const router = Router();

// auth/...
router.get("/login", authController.loginGet);
router.post("/login", authController.loginPost);

router.get('/register', authController.registerGet)
router.post('/register', authController.registerPost)

router.get('/forgot-password',authController.forgotPasswordGet)
router.post('/forgot-password',authController.forgotPasswordPost)

router.get('/reset-password/:token',authController.resetPasswordGet)
router.post('/reset-password/:token',authController.resetPasswordPost)

router.post('/logout', authController.logoutGet)


module.exports = router;









// router.post("/login", authController.loginPost);

// router.get("/signup", authController.signUpGet);
// router.post("/signup", authController.signUpPost);

// router.post("/logout", authController.logoutPost);

// // Optional password reset routes
// router.get("/forgot", authController.forgotGet);
// router.post("/forgot", authController.forgotPost);
// router.get("/reset/:token", authController.resetGet);
// router.post("/reset/:token", authController.resetPost);
/* 
| HTTP | Route           | Description                           |
| ---- | --------------- | ------------------------------------- |
| GET  | `/login`        | Show login form                       |
| POST | `/login`        | Handle login submission               |
| GET  | `/register`     | Show registration form                |
| POST | `/register`     | Handle registration submission        |
| POST | `/logout`       | Log the user out                      |
| GET  | `/forgot`       | Show "forgot password" form           |
| POST | `/forgot`       | Send reset link via email             |
| GET  | `/reset/:token` | Show new password form                |
| POST | `/reset/:token` | Handle password reset form submission |
| GET  | `/`             | (Optional) Home or welcome page       |
*/
