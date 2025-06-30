import React, { useState, useEffect } from 'react';
import {
  Paper, Title, Text, Group, Button, Stack, Alert, Loader, Box, Badge, Modal, Textarea
} from '@mantine/core';
import { IconCalendarPlus, IconCheck, IconClock, IconX, IconRefresh } from '@tabler/icons-react';

const STATUS_COLORS = {
  pending: 'yellow',
  scheduled: 'blue',
  completed: 'green',
  rejected: 'red',
  rescheduled: 'orange',
  cancelled: 'gray',
};

export default function StudentSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/counselling-sessions/student_sessions/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      setSessions(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/counselling-sessions/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) throw new Error('Failed to request session');
      setSuccess('Session request submitted!');
      setModalOpen(false);
      setNotes('');
      fetchSessions();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSession = (session) => (
    <Paper key={session.id} p="md" shadow="xs" radius="md" withBorder mb="sm">
      <Group justify="space-between">
        <Group>
          <Badge color={STATUS_COLORS[session.status] || 'gray'}>{session.status_display}</Badge>
          {session.scheduled_time && (
            <Text c="dimmed" ml="sm"><IconClock size={14} style={{ marginRight: 4 }} /> {new Date(session.scheduled_time).toLocaleString()}</Text>
          )}
          {session.rescheduled_at && (
            <Badge color="orange" ml="sm" leftSection={<IconRefresh size={12} />}>Rescheduled</Badge>
          )}
        </Group>
        <Text>{session.notes}</Text>
      </Group>
      {session.rescheduled_at && (
        <Text size="sm" c="dimmed" mt="xs">
          Rescheduled at: {new Date(session.rescheduled_at).toLocaleString()}<br />
          Reason: {session.reschedule_reason}
        </Text>
      )}
    </Paper>
  );

  return (
    <Box maw={700} mx="auto" my="xl">
      <Title order={2} mb="md">My Counselling Sessions</Title>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      {success && <Alert color="green" mb="md">{success}</Alert>}
      <Button leftSection={<IconCalendarPlus size={16} />} mb="md" onClick={() => setModalOpen(true)}>
        Request New Session
      </Button>
      {loading ? <Loader /> : (
        <Stack>
          {sessions.length === 0 && <Text c="dimmed">No sessions yet.</Text>}
          {sessions.map(renderSession)}
        </Stack>
      )}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Request Counselling Session">
        <form onSubmit={handleRequest}>
          <Stack>
            <Textarea
              label="Notes (optional)"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              minRows={3}
            />
            <Button type="submit">Submit Request</Button>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
} 