import axios from 'axios';

export default {
    saveUser: function(userData) {
        return axios.post("/api/users", userData);
    },

    getAllUsers: function() {
        return axios.get('/api/users')
    },

    startMatch: function() {
        return axios.post('/api/matches')
    }
};