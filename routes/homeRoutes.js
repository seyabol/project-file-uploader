// routes\homeRoutes.js

const { Router } = require("express");
const homeController = require("../controllers/homeController");

const router = Router();

// Homepage
router.get("/", homeController.homeGet);

module.exports = router;












// // About page
// router.get("/about", homeController.aboutGet);

// // Contact page (GET form)
// router.get("/contact", homeController.contactGet);

// // Contact form submission (POST)
// router.post("/contact", homeController.contactPost);

// // FAQ page (optional)
// router.get("/faq", homeController.faqGet);

// // Terms and Privacy
// router.get("/terms", homeController.termsGet);
// router.get("/privacy", homeController.privacyGet);

// // 404 fallback (optional)
// router.get("/404", homeController.notFound);
/*
| Route           | Purpose                              |
| --------------- | ------------------------------------ |
| `GET /`         | Homepage (landing page)              |
| `GET /about`    | About us page                        |
| `GET /contact`  | Contact form page                    |
| `POST /contact` | Handle contact form submission       |
| `GET /terms`    | Terms of service                     |
| `GET /privacy`  | Privacy policy page                  |
| `GET /faq`      | Frequently Asked Questions           |
| `GET /features` | Product or service features page     |
| `GET /pricing`  | Pricing plans                        |
| `GET /help`     | Help or support                      |
| `GET /404`      | Custom 404 Not Found page (optional) |
*/
