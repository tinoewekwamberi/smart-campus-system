import React, { useEffect, useState } from 'react';
import { Box, Title, Loader, Alert, Card, Group, Text, Badge, Stack } from '@mantine/core';

export default function SupportRequestHistory() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/support/support-requests/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch support requests');
      setRequests(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={800} mx="auto" my="xl">
      <Title order={2} mb="md">My Support Requests</Title>
      {loading ? <Loader /> : error ? <Alert color="red">{error}</Alert> : (
        <Stack>
          {requests.length === 0 ? (
            <Text c="dimmed">No support requests found.</Text>
          ) : requests.map(req => (
            <Card key={req.id} shadow="sm" p="md" radius="md" withBorder mb="sm">
              <Group justify="space-between" mb="xs">
                <Text fw={700}>{req.category} - {req.location}</Text>
                <Badge color={req.status === 'resolved' ? 'green' : req.status === 'in_progress' ? 'blue' : req.status === 'pending' ? 'yellow' : 'red'}>{req.status.replace('_', ' ')}</Badge>
              </Group>
              <Text size="sm" c="dimmed">{new Date(req.created_at).toLocaleString()}</Text>
              <Text mt="xs">{req.description}</Text>
              {req.resolution_notes && (
                <Alert color="green" mt="sm">Resolution: {req.resolution_notes}</Alert>
              )}
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
} 