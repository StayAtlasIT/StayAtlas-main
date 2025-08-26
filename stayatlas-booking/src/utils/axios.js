// src/api/axiosConfig.js
import axios from 'axios';

axios.defaults.withCredentials = true; 

// Normalize base URL: remove trailing slashes to avoid double slashes
const rawBaseUrl = (import.meta.env.VITE_BACKEND_URL || '').replace(/\/+$/, '');
axios.defaults.baseURL = rawBaseUrl;

// Interceptor to collapse accidental `/v1/v1` and handle mixed configurations
axios.interceptors.request.use((config) => {
	if (typeof config.url === 'string') {
		// Collapse any // to /
		config.url = config.url.replace(/([^:])\/+/g, '$1/');

		// If baseURL already ends with /api/v1 and the request path starts with /v1, drop the extra /v1
		if (rawBaseUrl.endsWith('/api/v1') && config.url.startsWith('/v1/')) {
			config.url = config.url.replace(/^\/v1\//, '/');
		}

		// Also fix absolute URLs that accidentally contain /api/v1/v1
		config.url = config.url.replace('/api/v1/v1/', '/api/v1/');
	}
	return config;
});

// axios.defaults.headers.common['Content-Type'] = 'application/json';
export default axios;
