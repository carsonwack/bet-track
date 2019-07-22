import axios from 'axios';

export default {
    saveUser: function(userData) {
        console.log('saving user')
        return axios.post("/api/users", userData);
    }
};