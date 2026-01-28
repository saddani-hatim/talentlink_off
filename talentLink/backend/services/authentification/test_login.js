import axios from 'axios';

const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:2020/api/auth/login', {
      email: 'candidate@example.com',
      password: 'password123'
    });
    console.log('Login Success:', response.data);
  } catch (error) {
    console.error('Login Failed:', error.response ? error.response.data : error.message);
  }
};

testLogin();
