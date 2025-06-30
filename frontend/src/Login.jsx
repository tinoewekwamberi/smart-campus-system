import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Alert, Loader } from '@mantine/core';
import axios from 'axios';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Login to get tokens
      const loginRes = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      
      localStorage.setItem('access', loginRes.data.access);
      localStorage.setItem('refresh', loginRes.data.refresh);
      
      // Fetch user info
      const userRes = await axios.get('http://localhost:8000/api/users/profile/self_profile/', {
        headers: { Authorization: `Bearer ${loginRes.data.access}` },
      });
      
      onLogin(userRes.data);
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.status === 401) {
        setError('Invalid username or password');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper p="md" shadow="xs" maw={400} mx="auto" mt={100}>
      <Title order={2} mb="md" align="center">Login</Title>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          mb="sm"
          disabled={loading}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          mb="md"
          disabled={loading}
        />
        {error && <Alert color="red" mb="md">{error}</Alert>}
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? <Loader size="sm" /> : 'Login'}
        </Button>
        <Button variant="subtle" fullWidth mt="sm" onClick={onSwitchToRegister} disabled={loading}>
          Don't have an account? Register
        </Button>
      </form>
    </Paper>
  );
} 