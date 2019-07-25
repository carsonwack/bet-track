const db = require("../models");

module.exports = {
    create: function (req, res) {
        db.User.findOneOrCreate({email: req.body.email}, req.body)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(422).json(err))
    },

    findAll: function(req, res){
        db.User.find({})
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(422).json(err))
    }
};