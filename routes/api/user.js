const router = require('express').Router();
const userController = require('../../controllers/userController');

// matches with '/api/users'
router.route("/")
    .post(userController.create)


module.exports = router;