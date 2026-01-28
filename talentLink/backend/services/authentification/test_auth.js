import axios from 'axios';

const testAuth = async () => {
  const email = `test_${Date.now()}@example.com`;
  const password = 'Password123!';
  
  try {
    console.log(`Attempting signup for ${email}...`);
    const signupRes = await axios.post('http://localhost:2020/api/auth/signup', {
      email,
      password,
      role: 'CANDIDATE',
      firstName: 'Test',
      lastName: 'User'
    });
    console.log('Signup Success:', signupRes.data);

    console.log(`Attempting login for ${email}...`);
    const loginRes = await axios.post('http://localhost:2020/api/auth/login', {
      email,
      password
    });
    console.log('Login Success:', loginRes.data);
    console.log('Cookies received:', loginRes.headers['set-cookie']);
  } catch (error) {
    console.error('Auth Test Failed:', error.response ? error.response.data : error.message);
  }
};

testAuth();
