const db = require("../models");

module.exports = {

    start: function (req, res) {
        const scoresArray = [`${req.body.userEmail} ${0}`, `${req.body.opponentEmail} ${0}`]
        const nameArray = [`${req.body.userEmail} ${req.body.name1}`, `${req.body.opponentEmail} ${req.body.name2}`]
        db.Match.create({
            emails: [req.body.userEmail, req.body.opponentEmail],
            scores: scoresArray,
            names: nameArray
        })
            .then(match => { res.json(match) })
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
    },

    getAllBets: function (req, res) {
        db.Match.findById(req.params.id, "propBets")
            .then(match => res.json(match))
            .catch(err => res.status(422).json(err))
    },

    yesChosen: function (req, res) {
        db.Match.updateOne({ "_id": req.params.id, "propBets._id": req.body.betId },
            {
                $set: { "propBets.$.selected": req.body.val }
            })
            .then(match => res.json(match))
            .catch(err => res.status(422).json(err))
    },

    wonLostChosen: function (req, res) {
        db.Match.findByIdAndUpdate(req.params.id, { scores: [req.body.myString, req.body.oppString] }, { useFindAndModify: false })
            .then(() => (db.Match.updateOne({ "_id": req.params.id, "propBets._id": req.body.betId },
                {
                    $set: { "propBets.$.whoWon": req.body.won }
                })))
            .then(match => res.json(match))
            .catch(err => res.status(422).json(err))
    },
};

