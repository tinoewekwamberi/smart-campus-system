import React, { useState, useEffect } from 'react';
import {
  Paper, Title, Text, Group, Button, Stack, Alert, Loader, Box, Badge, Tabs, Modal, Textarea, Select
} from '@mantine/core';
import { IconUser, IconCalendar, IconCheck, IconAlertCircle } from '@tabler/icons-react';

const MOOD_EMOJIS = {
  very_happy: '😄',
  happy: '🙂',
  neutral: '😐',
  sad: '🙁',
  very_sad: '😢',
};

export default function StaffDashboard() {
  const [tab, setTab] = useState('flagged');
  const [flagged, setFlagged] = useState([]);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const flaggedRes = await fetch('http://localhost:8000/api/wellness/checkins/flagged/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const allRes = await fetch('http://localhost:8000/api/wellness/checkins/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!flaggedRes.ok || !allRes.ok) throw new Error('Failed to fetch check-ins');
      setFlagged(await flaggedRes.json());
      setAll(await allRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (checkin) => {
    setSelectedCheckin(checkin);
    setModalOpen(true);
    setSessionNotes('');
    setSessionTime('');
    setSuccess('');
  };

  const handleSchedule = async () => {
    if (!sessionTime) return;
    setSuccess('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/counselling-sessions/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student: selectedCheckin.user,
          scheduled_time: sessionTime,
          notes: sessionNotes,
        }),
      });
      if (!res.ok) throw new Error('Failed to schedule session');
      setSuccess('Session scheduled!');
      setModalOpen(false);
    } catch (err) {
      setSuccess('');
      setError(err.message);
    }
  };

  const renderCheckin = (item) => (
    <Paper key={item.id} p="md" shadow="xs" radius="md" withBorder mb="sm">
      <Group justify="space-between">
        <Group>
          <Text size="xl">{MOOD_EMOJIS[item.mood] || item.mood}</Text>
          <Text c="dimmed">{new Date(item.created_at).toLocaleDateString()}</Text>
          <Badge color={item.flagged ? 'red' : 'gray'} leftSection={<IconAlertCircle size={12} />}>{item.flagged ? 'Flagged' : 'Normal'}</Badge>
        </Group>
        <Group>
          <Button size="xs" leftSection={<IconUser size={14} />} onClick={() => openModal(item)}>
            Schedule Session
          </Button>
        </Group>
      </Group>
      <Text fw={500} mt="xs">Student: {item.user}</Text>
      {item.notes && <Text mt="xs">{item.notes}</Text>}
    </Paper>
  );

  return (
    <Box maw={800} mx="auto" my="xl">
      <Title order={2} mb="md">Staff Wellness Dashboard</Title>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      {success && <Alert color="green" mb="md">{success}</Alert>}
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="flagged">Flagged Check-ins</Tabs.Tab>
          <Tabs.Tab value="all">All Check-ins</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="flagged" pt="md">
          {loading ? <Loader /> : (
            <Stack>
              {flagged.length === 0 && <Text c="dimmed">No flagged check-ins.</Text>}
              {flagged.map(renderCheckin)}
            </Stack>
          )}
        </Tabs.Panel>
        <Tabs.Panel value="all" pt="md">
          {loading ? <Loader /> : (
            <Stack>
              {all.length === 0 && <Text c="dimmed">No check-ins found.</Text>}
              {all.map(renderCheckin)}
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Schedule Counselling Session">
        <Stack>
          <Text fw={500}>Student ID: {selectedCheckin?.user}</Text>
          <Text>Check-in Date: {selectedCheckin && new Date(selectedCheckin.created_at).toLocaleDateString()}</Text>
          <Textarea
            label="Session Notes"
            value={sessionNotes}
            onChange={e => setSessionNotes(e.target.value)}
          />
          <input
            type="datetime-local"
            value={sessionTime}
            onChange={e => setSessionTime(e.target.value)}
            style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
          <Button leftSection={<IconCalendar size={16} />} onClick={handleSchedule} disabled={!sessionTime}>
            Schedule
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
} 