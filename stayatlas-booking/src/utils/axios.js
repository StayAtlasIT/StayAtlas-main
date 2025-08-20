// src/api/axiosConfig.js
import axios from 'axios';

axios.defaults.withCredentials = true; 
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
// axios.defaults.headers.common['Content-Type'] = 'application/json';

export default axios;
