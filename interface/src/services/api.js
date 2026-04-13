import axios  from "axios";

const API_BASE_URL = "http://localhost:8080/BizChat";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('API Request: ', {
      method: config.method?.toUpperCase(),
      url: config.url,
      fillurl:`${API_BASE_URL}${config.url}`,
      hasToken: !!token
    })

    return config;
  },
  (error) => {
    console.error('Request Error: ', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
(response) => {
   console.log('✅ API Response:', response.status, response.config.url); 
  return response;
},
(error)=>{
   console.error(' API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.response?.data || error.message
    });

  if (error.response?.status === 401) {
      console.log(' Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  return Promise.reject(error);
}
)

export default api; 
