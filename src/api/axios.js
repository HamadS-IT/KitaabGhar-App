import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:3000/api/v1', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;
