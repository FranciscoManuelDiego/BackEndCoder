const express = require("express");
const router = express.Router();
const passport = require("passport");

// Register with passport
router.post("/register", passport.authenticate("register", {
    successRedirect: "/",
    failureRedirect: "/register",
}));

// Login route with passport
router.post("/login", passport.authenticate("login", {
    failureRedirect: "/api/sessions/faillogin",
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
  
    res.redirect("/profile");
  });
router.get("/faillogin", async (req, res) => {
    res.send({error: "Login failed :("});
})

//Logout

router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy();
    }
    res.redirect("/login");
})

module.exports = router;