const express = require("express");
const router = express.Router();
const passport = require("passport");

// Register with passport
router.post("/register", passport.authenticate("register", {
    successRedirect: "/login",
    failureRedirect: "/register",
}));

// Login route with passport
router.post("/login", passport.authenticate("login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true // Enable flash messages (optional)
  }), async (req, res) => {
    if (!req.user) {
      return res.status(401).send({ error: "Login failed. Please check your credentials." }); // 401 for Unauthorized
    }
  
    req.session.user = {
      full_name: req.user.full_name,
      email: req.user.email
    };
  
    req.session.login = true;
  
    res.redirect("/");
  });

//Logout

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

// Profile route
router.get("/profile", (req, res) => {
  // Check if user is logged in
  if (!req.session.login || !req.session.user) {
      return res.redirect("/login");
  }

  // Pass user data to the Handlebars template
  res.render("profile", { user: req.session.user });
});

module.exports = router;