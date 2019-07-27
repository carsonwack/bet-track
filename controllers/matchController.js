const db = require("../models");

module.exports = {

    start: function (req, res) {
        const scores = [`${req.body.userEmail} ${0}`, `${req.body.opponentEmail} ${0}`]
        db.Match.create({
            emails: [req.body.userEmail, req.body.opponentEmail],
            scores: scores
        })
            .then( match => res.json(match))
            .catch( err => res.status(422).json(err))
    },

    findById: function (req, res) {
        db.Match.findById(req.params.id)
            .then( match => res.json(match))
            .catch( err => res.status(422).json(err))
    }
};