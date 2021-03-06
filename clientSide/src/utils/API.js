import axios from 'axios';

export default {

    // USER
    saveUser: function(userData) {
        return axios.post('/api/users', userData);
    },

    getAllUsers: function() {
        return axios.get('/api/users')
    },


    // MATCH
    getAllMatches: function(userEmail) {
        return axios.get('/api/matches/email/' + userEmail)
    },

    startMatch: function(matchData) {
        return axios.post('/api/matches', matchData)
    },

    getMatch: function(id) {
        return axios.get('/api/matches/' + id)
    },

    addBet: function(matchId, bet) {
        return axios.post('/api/matches/' + matchId, bet)
    },

    getAllBets: function(matchId) {
        return axios.get('/api/matches/bets/' + matchId)
    },

    yesChosen: function(matchId, betIdAndBool) {
        return axios.put('/api/matches/betUpdate/' + matchId, betIdAndBool)
    },

    wonLostChosen: function(matchId, scoresBetIdAndBool) {
        return axios.put('/api/matches/betWonLost/' + matchId, scoresBetIdAndBool)
    },

    deleteBet: function(matchId, betId) {
        return axios.delete(`/api/matches/${matchId}/${betId}`)
    }
};