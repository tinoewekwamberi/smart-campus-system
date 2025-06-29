import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Alert } from '@mantine/core';
import axios from 'axios';

export default function Login({ onLogin, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:8000/api/token/', {
        username,
        password,
      });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      onLogin();
    } catch (err) {
      setError('Invalid credentials');
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
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          mb="md"
        />
        {error && <Alert color="red" mb="md">{error}</Alert>}
        <Button type="submit" fullWidth>Login</Button>
        <Button variant="subtle" fullWidth mt="sm" onClick={onSwitchToRegister}>
          Don't have an account? Register
        </Button>
      </form>
    </Paper>
  );
} 