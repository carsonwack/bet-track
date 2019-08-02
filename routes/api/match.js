const router = require('express').Router();
const matchController = require('../../controllers/matchController');

// Matches with '/api/matches'
router.route('/')
    .post(matchController.start)

// Matches with '/api/matches/email/:email'
router.route('/email/:email')
    .get(matchController.getAllMatches)

// Matches with '/api/matches/bets/:id'
router.route('/bets/:id')
    .get(matchController.getAllBets)

// Matches with '/api/matches/betUpdate/:id'
router.route('/betUpdate/:id')
    .put(matchController.yesChosen)

// Matches with '/api/matches/betWonLost/:id'
router.route('/betWonLost/:id')
    .put(matchController.wonLostChosen)

// Matches with '/api/matches/:id'
router
    .route('/:id')
    .get(matchController.findById)
    .post(matchController.addBet)

module.exports = router;