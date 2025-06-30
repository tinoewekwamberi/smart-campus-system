import React, { useState, useEffect } from 'react';
import {
  Paper, Title, Text, Group, Button, Textarea, Stack, Alert, Loader, Box, Badge
} from '@mantine/core';
import { IconMoodHappy, IconMoodSmile, IconMoodNeutral, IconMoodSad, IconMoodCry } from '@tabler/icons-react';

const MOOD_OPTIONS = [
  { value: 'very_happy', label: '😄', icon: IconMoodHappy },
  { value: 'happy', label: '🙂', icon: IconMoodSmile },
  { value: 'neutral', label: '😐', icon: IconMoodNeutral },
  { value: 'sad', label: '🙁', icon: IconMoodSad },
  { value: 'very_sad', label: '😢', icon: IconMoodCry },
];

export default function StudentCheckin() {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setFetching(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/checkins/history/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch history');
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/checkins/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mood, notes }),
      });
      if (!res.ok) throw new Error('Failed to submit check-in');
      setSuccess('Check-in submitted!');
      setMood('');
      setNotes('');
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={600} mx="auto" my="xl">
      <Paper shadow="sm" p="xl" radius="md">
        <Title order={2} mb="md">Mental Health Check-in</Title>
        <Text mb="md">How are you feeling today? Select your mood and add any comments.</Text>
        {error && <Alert color="red" mb="md">{error}</Alert>}
        {success && <Alert color="green" mb="md">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Group>
              {MOOD_OPTIONS.map(opt => (
                <Button
                  key={opt.value}
                  variant={mood === opt.value ? 'filled' : 'light'}
                  color={mood === opt.value ? 'blue' : 'gray'}
                  onClick={() => setMood(opt.value)}
                  leftSection={<opt.icon size={24} />}
                  size="lg"
                >
                  {opt.label}
                </Button>
              ))}
            </Group>
            <Textarea
              label="Notes / Comments (optional)"
              placeholder="Share anything you'd like..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              minRows={2}
            />
            <Button type="submit" loading={loading} disabled={!mood}>
              Submit Check-in
            </Button>
          </Stack>
        </form>
      </Paper>

      <Title order={3} mt="xl" mb="md">Your Check-in History</Title>
      {fetching ? <Loader /> : (
        <Stack gap="sm">
          {history.length === 0 && <Text c="dimmed">No check-ins yet.</Text>}
          {history.map(item => (
            <Paper key={item.id} p="md" shadow="xs" radius="md" withBorder>
              <Group justify="space-between">
                <Group>
                  <Text size="xl">{MOOD_OPTIONS.find(opt => opt.value === item.mood)?.label || item.mood}</Text>
                  <Text c="dimmed">{new Date(item.created_at).toLocaleDateString()}</Text>
                </Group>
                {item.flagged && <Badge color="red">Flagged</Badge>}
              </Group>
              {item.notes && <Text mt="xs">{item.notes}</Text>}
            </Paper>
          ))}
        </Stack>
      )}
    </Box>
  );
} 