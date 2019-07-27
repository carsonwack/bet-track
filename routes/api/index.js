const path = require("path");
const router = require("express").Router();
const userRoutes = require("./user");
const matchRoutes = require("./match");

router.use("/users", userRoutes);
router.use("/matches", matchRoutes);

// For anything else, render the html page
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, "../../clientSide/build/index.html"));
});

module.exports = router;
