const router = require('express').Router();
const matchController = require('../../controllers/matchController');

// Matches with '/api/matches'
router.route('/')
    .post(matchController.start)


router.route('/:email')
    .get(matchController.getAllMatches)



// Matches with '/api/matches/:id'
router
    .route('/:id')
    .get(matchController.findById)
    .post(matchController.addBet)

module.exports = router;