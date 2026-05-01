const BASE_URL = 'http://localhost:5000/api';

const api = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  // Browser must set Content-Type for FormData to include boundary
  if (isFormData) {
    delete headers['Content-Type'];
  }

  const config = {
    ...options,
    headers,
    body: (options.body && typeof options.body === 'object' && !isFormData) 
      ? JSON.stringify(options.body) 
      : options.body
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
};

export default api;
