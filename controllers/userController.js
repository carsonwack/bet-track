const db = require('../models');
const axios = require('axios');
const server = require(`../server.js`);

getOrCreate = (req, res) => {
    const user = req.body;
    const aUser = new db.User(user)

    aUser.save().then(() => {
        return res.status(200).json({
            success: true,
            email: aUser.email,
            message: 'user created!'
        })
            .catch(error => {
                return res.status(400).json({
                    error,
                    message: 'Nope',
                })
            })

    })

}

module.exports = {
    getOrCreate
}