const db = require("../models");

module.exports = {

    start: function (req, res) {
        const scores = [`${req.body.userEmail} ${0}`, `${req.body.opponentEmail} ${0}`]
        db.Match.create({
            emails: [req.body.userEmail, req.body.opponentEmail],
            scores: scores
        })
            .then(match => res.json(match))
            .catch(err => res.status(422).json(err))
    },

    findById: function (req, res) {
        db.Match.findById(req.params.id)
            .then(match => res.json(match))
            .catch(err => res.status(422).json(err))
    },

    addBet: function (req, res) {
        db.Match.findByIdAndUpdate(req.params.id,
            {
                $push: {
                    propBets: {
                        "propLabels": req.body.bet,
                        "selected": "notYet",
                        "userWon": "notYet"
                    }
                }
            }, { useFindAndModify: false })
            .then(match => res.json(match))
            .catch(err => res.status(422).json(err))
    },

    getAllMatches: function (req, res) {
        db.Match.find({ emails: req.params.email })
            .then(match => res.json(match))
            .catch(err => res.status(422).json(err))
    }
};




