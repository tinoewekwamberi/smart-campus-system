import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Alert, Select, Group } from '@mantine/core';
import axios from 'axios';

export default function Register({ onRegister, onSwitchToLogin }) {
  const [form, setForm] = useState({ 
    username: '', 
    password: '', 
    email: '', 
    role: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleRoleChange = (value) => {
    setForm({ ...form, role: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Basic validation
    if (!form.username || !form.password || !form.email || !form.role) {
      setError('All fields are required');
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:8000/api/accounts/register/', form);
      setSuccess('Registration successful! You can now log in.');
      setForm({ username: '', password: '', email: '', role: '', first_name: '', last_name: '' });
      onRegister && onRegister();
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Paper p="md" shadow="xs" maw={400} mx="auto" mt={100}>
      <Title order={2} mb="md" align="center">Register</Title>
      <form onSubmit={handleSubmit}>
        <Group grow>
          <TextInput
            label="First Name"
            value={form.first_name}
            onChange={handleChange('first_name')}
            mb="sm"
          />
          <TextInput
            label="Last Name"
            value={form.last_name}
            onChange={handleChange('last_name')}
            mb="sm"
          />
        </Group>
        
        <TextInput
          label="Username"
          value={form.username}
          onChange={handleChange('username')}
          required
          mb="sm"
        />
        
        <TextInput
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange('email')}
          required
          mb="sm"
        />
        
        <PasswordInput
          label="Password"
          value={form.password}
          onChange={handleChange('password')}
          required
          mb="sm"
        />
        
        <Select
          label="Role"
          data={[
            { value: 'student', label: 'Student' },
            { value: 'lecturer', label: 'Lecturer' },
            { value: 'staff', label: 'Staff' },
          ]}
          value={form.role}
          onChange={handleRoleChange}
          required
          mb="md"
          placeholder="Select your role"
        />
        
        {error && <Alert color="red" mb="md">{error}</Alert>}
        {success && <Alert color="green" mb="md">{success}</Alert>}
        
        <Button type="submit" fullWidth>Register</Button>
        <Button variant="subtle" fullWidth mt="sm" onClick={onSwitchToLogin}>
          Already have an account? Log in
        </Button>
      </form>
    </Paper>
  );
} 