import React, { useEffect, useState } from 'react';
import { Box, Title, Loader, Alert, Table, Badge, Group, Text, Stack } from '@mantine/core';

export default function SupportDashboard() {
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
    <Box maw={1200} mx="auto" my="xl">
      <Title order={2} mb="md">Support Requests Dashboard</Title>
      {loading ? <Loader /> : error ? <Alert color="red">{error}</Alert> : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Category</Table.Th>
              <Table.Th>Location</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Created</Table.Th>
              <Table.Th>Assigned To</Table.Th>
              <Table.Th>Resolution</Table.Th>
              {/* <Table.Th>Actions</Table.Th> // Blueprint for status update, assign, etc. */}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {requests.length === 0 ? (
              <Table.Tr><Table.Td colSpan={8}><Text c="dimmed">No support requests found.</Text></Table.Td></Table.Tr>
            ) : requests.map(req => (
              <Table.Tr key={req.id}>
                <Table.Td>{req.user}</Table.Td>
                <Table.Td>{req.category}</Table.Td>
                <Table.Td>{req.location}</Table.Td>
                <Table.Td>{req.description}</Table.Td>
                <Table.Td>
                  <Badge color={req.status === 'resolved' ? 'green' : req.status === 'in_progress' ? 'blue' : req.status === 'pending' ? 'yellow' : 'red'}>{req.status.replace('_', ' ')}</Badge>
                </Table.Td>
                <Table.Td>{new Date(req.created_at).toLocaleString()}</Table.Td>
                <Table.Td>{req.assigned_to || '-'}</Table.Td>
                <Table.Td>{req.resolution_notes || '-'}</Table.Td>
                {/* <Table.Td>
                  // Blueprint: Add status update, assign, resolve actions here
                </Table.Td> */}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      {/* Blueprint: Add filtering, search, status update, assign, resolve, etc. */}
    </Box>
  );
} 