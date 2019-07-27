const router = require('express').Router();
const matchController = require('../../controllers/matchController');

// Matches with '/api/matches'
router.route('/')
    .post(matchController.start)

// Matches with '/api/matches/:id'
router
    .route('/:id')
    .get(matchController.findById)

module.exports = router;