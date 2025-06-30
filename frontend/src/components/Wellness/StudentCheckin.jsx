import React, { useState, useEffect } from 'react';
import {
  Paper, Title, Text, Group, Button, Textarea, Stack, Alert, Loader, Box, Badge
} from '@mantine/core';
import { IconMoodHappy, IconMoodSmile, IconMoodNeutral, IconMoodSad, IconMoodCry, IconCalendarPlus, IconCheck, IconClock, IconX, IconRefresh } from '@tabler/icons-react';
import { Modal } from '@mantine/core';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip, Legend);

const MOOD_OPTIONS = [
  { value: 'very_happy', label: '😄', icon: IconMoodHappy },
  { value: 'happy', label: '🙂', icon: IconMoodSmile },
  { value: 'neutral', label: '😐', icon: IconMoodNeutral },
  { value: 'sad', label: '🙁', icon: IconMoodSad },
  { value: 'very_sad', label: '😢', icon: IconMoodCry },
];

const STATUS_COLORS = {
  pending: 'yellow',
  scheduled: 'blue',
  completed: 'green',
  rejected: 'red',
  rescheduled: 'orange',
  cancelled: 'gray',
};

export default function StudentCheckin() {
  const [mood, setMood] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [sessionsError, setSessionsError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionSuccess, setSessionSuccess] = useState('');
  const [trends, setTrends] = useState(null);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState('');

  useEffect(() => {
    fetchHistory();
    fetchSessions();
    fetchTrends();
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

  const fetchSessions = async () => {
    setSessionsLoading(true);
    setSessionsError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/counselling-sessions/student_sessions/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch sessions');
      setSessions(await res.json());
    } catch (err) {
      setSessionsError(err.message);
    } finally {
      setSessionsLoading(false);
    }
  };

  const fetchTrends = async () => {
    setTrendsLoading(true);
    setTrendsError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/checkins/my_trends/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch trends');
      setTrends(await res.json());
    } catch (err) {
      setTrendsError(err.message);
    } finally {
      setTrendsLoading(false);
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

  const handleSessionRequest = async (e) => {
    e.preventDefault();
    setSessionsError('');
    setSessionSuccess('');
    setSessionsLoading(true);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/counselling-sessions/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes: sessionNotes }),
      });
      if (!res.ok) throw new Error('Failed to request session');
      setSessionSuccess('Session request submitted!');
      setModalOpen(false);
      setSessionNotes('');
      fetchSessions();
    } catch (err) {
      setSessionsError(err.message);
    } finally {
      setSessionsLoading(false);
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
      <Stack gap={2} mt="xs">
        {session.created_by && (
          <Text size="sm" c="dimmed">Scheduled by: <b>{session.created_by.full_name}</b></Text>
        )}
        {session.approved_by && (
          <Text size="sm" c="dimmed">Approved by: <b>{session.approved_by.full_name}</b></Text>
        )}
        {session.rescheduled_at && (
          <Text size="sm" c="dimmed">
            Rescheduled at: {new Date(session.rescheduled_at).toLocaleString()}<br />
            Reason: {session.reschedule_reason}
          </Text>
        )}
      </Stack>
    </Paper>
  );

  return (
    <Box maw={600} mx="auto" my="xl">
      <Paper shadow="sm" p="xl" radius="md" mb="lg">
        <Title order={3} mb="sm">My Wellness Trends (Last 30 Days)</Title>
        {trendsLoading ? <Loader /> : trendsError ? <Alert color="red">{trendsError}</Alert> : (
          <>
            <Bar
              data={{
                labels: Object.keys(trends?.mood_counts || {}),
                datasets: [
                  {
                    label: 'Mood Count',
                    data: Object.values(trends?.mood_counts || {}),
                    backgroundColor: '#228be6',
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false },
                  title: { display: false },
                },
              }}
              height={200}
            />
            <Text mt="sm">Flagged Check-ins: <b>{trends?.flagged_count || 0}</b> / {trends?.total || 0}</Text>
          </>
        )}
      </Paper>
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

      <Title order={3} mt="xl" mb="md">Your Counselling Sessions</Title>
      {sessionsError && <Alert color="red" mb="md">{sessionsError}</Alert>}
      {sessionSuccess && <Alert color="green" mb="md">{sessionSuccess}</Alert>}
      <Button leftSection={<IconCalendarPlus size={16} />} mb="md" onClick={() => setModalOpen(true)}>
        Request New Session
      </Button>
      {sessionsLoading ? <Loader /> : (
        <Stack>
          {sessions.length === 0 && <Text c="dimmed">No sessions yet.</Text>}
          {sessions.map(renderSession)}
        </Stack>
      )}
      <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title="Request Counselling Session">
        <form onSubmit={handleSessionRequest}>
          <Stack>
            <Textarea
              label="Notes (optional)"
              value={sessionNotes}
              onChange={e => setSessionNotes(e.target.value)}
              minRows={3}
            />
            <Button type="submit">Submit Request</Button>
          </Stack>
        </form>
      </Modal>
    </Box>
  );
} 