import { useEffect, useState } from 'react';
import { Button, Paper, Title, Text, Loader, Alert } from '@mantine/core';
import axios from 'axios';

export default function Home({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const access = localStorage.getItem('access');
        const res = await axios.get('http://localhost:8000/api/accounts/me/', {
          headers: { Authorization: `Bearer ${access}` },
        });
        setUser(res.data);
      } catch (err) {
        setError('Failed to fetch user info');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    onLogout();
  };

  if (loading) return <Loader mt={100} mx="auto" />;
  if (error) return <Alert color="red">{error}</Alert>;

  return (
    <Paper p="md" shadow="xs" maw={400} mx="auto" mt={100}>
      <Title order={2} mb="md">Welcome, {user?.username}!</Title>
      <Text mb="md">Email: {user?.email}</Text>
      <Button color="red" onClick={handleLogout} fullWidth>Logout</Button>
    </Paper>
  );
} 