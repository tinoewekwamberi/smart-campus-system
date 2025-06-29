import { useEffect, useState } from 'react';
import { Button, Paper, Title, Text, Loader, Alert, Badge, Group } from '@mantine/core';
import axios from 'axios';

export default function Home({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const access = localStorage.getItem('access');
        if (!access) {
          setError('No access token found. Please login again.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:8000/api/accounts/me/', {
          headers: { Authorization: `Bearer ${access}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user:', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please login again.');
          // Clear invalid tokens
          localStorage.removeItem('access');
          localStorage.removeItem('refresh');
        } else {
          setError('Failed to fetch user info. Please try again.');
        }
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

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return 'blue';
      case 'lecturer': return 'green';
      case 'staff': return 'orange';
      default: return 'gray';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'student': return 'Student';
      case 'lecturer': return 'Lecturer';
      case 'staff': return 'Staff';
      default: return role;
    }
  };

  if (loading) return <Loader mt={100} mx="auto" />;
  if (error) return <Alert color="red" title="Error">{error}</Alert>;

  return (
    <Paper p="md" shadow="xs" maw={500} mx="auto" mt={100}>
      <Title order={2} mb="md">Welcome, {user?.first_name || user?.username}!</Title>
      
      <Group mb="md">
        <Text size="sm" c="dimmed">Role:</Text>
        <Badge color={getRoleColor(user?.role)} size="lg">
          {getRoleDisplayName(user?.role)}
        </Badge>
      </Group>
      
      <Text mb="xs"><strong>Username:</strong> {user?.username}</Text>
      <Text mb="xs"><strong>Email:</strong> {user?.email}</Text>
      {user?.first_name && <Text mb="xs"><strong>First Name:</strong> {user.first_name}</Text>}
      {user?.last_name && <Text mb="xs"><strong>Last Name:</strong> {user.last_name}</Text>}
      
      <Button color="red" onClick={handleLogout} fullWidth mt="md">
        Logout
      </Button>
    </Paper>
  );
} 