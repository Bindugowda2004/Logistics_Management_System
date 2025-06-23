import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  async login(username, password) {
    console.log('Attempting login for user:', username);
    try {
      // Create the request configuration with CORS headers
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      };
      
      // Make the login request
      const response = await axios.post(
        API_URL + 'login', 
        { username, password },
        config
      );
      
      console.log('Login response:', response);
      
      // Check if we have a valid token in the response
      if (response.data && response.data.token) {
        // Store user details in localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
      } else {
        console.error('Invalid login response format:', response.data);
        return { 
          success: false, 
          message: 'Invalid response from server. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle error response
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        if (error.response.data && error.response.data.message) {
          return { 
            success: false, 
            message: error.response.data.message 
          };
        }
      }
      
      return { 
        success: false, 
        message: error.message || 'Login failed. Please try again.' 
      };
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(username, email, password, role) {
    console.log('Registering new user:', username, 'with role:', role);
    return axios.post(API_URL + 'register', {
      username,
      email,
      password,
      role
    })
    .then(response => {
      console.log('Registration successful:', response.data);
      return response;
    })
    .catch(error => {
      console.error('Registration error:', error);
      throw error;
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
}

export default new AuthService();
