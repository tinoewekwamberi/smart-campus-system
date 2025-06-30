import React, { useState } from 'react';
import { Box, Title, TextInput, Textarea, Button, Select, Alert } from '@mantine/core';

const CATEGORY_OPTIONS = [
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'pest', label: 'Pest Control' },
  { value: 'other', label: 'Other' },
];

export default function SupportRequestForm() {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/support/support-requests/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, location, description }),
      });
      if (!res.ok) throw new Error('Failed to submit request');
      setSuccess('Support request submitted!');
      setCategory('');
      setLocation('');
      setDescription('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={500} mx="auto" my="xl">
      <Title order={2} mb="md">Submit a Support Request</Title>
      {success && <Alert color="green" mb="md">{success}</Alert>}
      {error && <Alert color="red" mb="md">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Select
          label="Category"
          placeholder="Select category"
          data={CATEGORY_OPTIONS}
          value={category}
          onChange={setCategory}
          required
          mb="md"
        />
        <TextInput
          label="Location (e.g., Dorm 5, Room 12)"
          placeholder="Enter location"
          value={location}
          onChange={e => setLocation(e.target.value)}
          required
          mb="md"
        />
        <Textarea
          label="Description"
          placeholder="Describe the issue"
          value={description}
          onChange={e => setDescription(e.target.value)}
          minRows={3}
          required
          mb="md"
        />
        <Button type="submit" loading={loading} fullWidth>
          Submit Request
        </Button>
      </form>
    </Box>
  );
} 