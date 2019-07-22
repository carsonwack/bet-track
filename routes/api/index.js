const path = require("path");
const router = require("express").Router();
const userRoutes = require("./user");
// const googleRoutes = require("./google");

// User routes
router.use("/users", userRoutes);

// Google Routes
// router.use("/google", googleRoutes);

// For anything else, render the html page
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../../clientSide/build/index.html"));
});

module.exports = router;
