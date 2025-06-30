import React, { useState, useEffect } from 'react';
import {
  Paper, Title, Text, Group, Button, Stack, Alert, Loader, Box, Badge, Tabs, Modal, Textarea, Select, Drawer
} from '@mantine/core';
import { IconUser, IconCalendar, IconCheck, IconAlertCircle, IconHistory, IconX, IconRefresh } from '@tabler/icons-react';
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

const MOOD_EMOJIS = {
  very_happy: '😄',
  happy: '🙂',
  neutral: '😐',
  sad: '🙁',
  very_sad: '😢',
};

export default function StaffDashboard({ user }) {
  const [tab, setTab] = useState('flagged');
  const [flagged, setFlagged] = useState([]);
  const [all, setAll] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [success, setSuccess] = useState('');
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [studentHistory, setStudentHistory] = useState([]);
  const [actionModal, setActionModal] = useState({ open: false, type: '', session: null });
  const [actionNotes, setActionNotes] = useState('');
  const [actionTime, setActionTime] = useState('');
  const [actionReason, setActionReason] = useState('');
  const [trends, setTrends] = useState(null);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [trendsError, setTrendsError] = useState('');
  const isCounsellorOrAdmin = user?.staff_type === 'counsellor' || user?.staff_type === 'admin';

  useEffect(() => {
    fetchData();
    fetchTrends();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      let flaggedData = [], allData = [], sessionData = [];
      if (isCounsellorOrAdmin) {
        const flaggedRes = await fetch('http://localhost:8000/api/wellness/checkins/flagged/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!flaggedRes.ok) throw new Error('Failed to fetch flagged check-ins');
        flaggedData = await flaggedRes.json();
      }
      const allRes = await fetch('http://localhost:8000/api/wellness/checkins/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!allRes.ok) throw new Error('Failed to fetch check-ins');
      allData = await allRes.json();
      if (isCounsellorOrAdmin) {
        const sessionRes = await fetch('http://localhost:8000/api/wellness/counselling-sessions/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!sessionRes.ok) throw new Error('Failed to fetch sessions');
        sessionData = await sessionRes.json();
      }
      setFlagged(flaggedData);
      setAll(allData);
      setSessions(sessionData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    setTrendsLoading(true);
    setTrendsError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/wellness/checkins/trends/', {
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
          student: typeof selectedCheckin.user === 'object' ? selectedCheckin.user.id : selectedCheckin.user,
          scheduled_time: sessionTime,
          notes: sessionNotes,
        }),
      });
      if (!res.ok) throw new Error('Failed to schedule session');
      setSuccess('Session scheduled!');
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setSuccess('');
      setError(err.message);
    }
  };

  const openHistoryDrawer = async (studentId) => {
    setHistoryDrawerOpen(true);
    setStudentHistory([]);
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`http://localhost:8000/api/wellness/checkins/?user=${studentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch student history');
      setStudentHistory(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionAction = async () => {
    if (!actionModal.session) return;
    setSuccess('');
    setError('');
    const token = localStorage.getItem('access');
    let url = `http://localhost:8000/api/wellness/counselling-sessions/${actionModal.session.id}/`;
    let body = {};
    if (actionModal.type === 'approve') {
      url += 'approve/';
      body = { scheduled_time: actionTime };
    } else if (actionModal.type === 'reject') {
      url += 'reject/';
      body = { notes: actionNotes };
    } else if (actionModal.type === 'reschedule') {
      url += 'reschedule/';
      body = { scheduled_time: actionTime, reschedule_reason: actionReason };
    }
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Failed to perform action');
      setSuccess('Action successful!');
      setActionModal({ open: false, type: '', session: null });
      setActionNotes('');
      setActionTime('');
      setActionReason('');
      fetchData();
    } catch (err) {
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
          {isCounsellorOrAdmin && (
            <Button size="xs" leftSection={<IconUser size={14} />} onClick={() => openModal(item)}>
              Schedule Session
            </Button>
          )}
          <Button size="xs" leftSection={<IconHistory size={14} />} onClick={() => openHistoryDrawer(item.user)}>
            View History
          </Button>
        </Group>
      </Group>
      <Text fw={500} mt="xs">Student: {item.user}</Text>
      {item.notes && <Text mt="xs">{item.notes}</Text>}
    </Paper>
  );

  const renderSession = (session) => (
    <Paper key={session.id} p="md" shadow="xs" radius="md" withBorder mb="sm">
      <Group justify="space-between">
        <Group>
          <Text fw={500}>Student: {session.student}</Text>
          <Text c="dimmed">Scheduled: {session.scheduled_time ? new Date(session.scheduled_time).toLocaleString() : 'N/A'}</Text>
          <Badge color={session.status === 'completed' ? 'green' : session.status === 'scheduled' ? 'blue' : session.status === 'rejected' ? 'red' : session.status === 'rescheduled' ? 'orange' : 'gray'}>{session.status}</Badge>
        </Group>
        <Text>{session.notes}</Text>
      </Group>
      <Stack gap={2} mt="xs">
        {session.created_by && (
          <Text size="sm" c="dimmed">Scheduled by: <b>{session.created_by.full_name}</b></Text>
        )}
        {session.approved_by && (
          <Text size="sm" c="dimmed">Action by: <b>{session.approved_by.full_name}</b></Text>
        )}
        {(session.status === 'pending' || session.status === 'rescheduled') && (
          <Group mt="xs">
            <Button size="xs" color="green" leftSection={<IconCheck size={14} />} onClick={() => setActionModal({ open: true, type: 'approve', session })}>Approve</Button>
            <Button size="xs" color="red" leftSection={<IconX size={14} />} onClick={() => setActionModal({ open: true, type: 'reject', session })}>Reject</Button>
            <Button size="xs" color="orange" leftSection={<IconRefresh size={14} />} onClick={() => setActionModal({ open: true, type: 'reschedule', session })}>Reschedule</Button>
          </Group>
        )}
      </Stack>
    </Paper>
  );

  return (
    <Box maw={900} mx="auto" my="xl">
      <Title order={2} mb="md">Staff Wellness Dashboard</Title>
      {error && <Alert color="red" mb="md">{error}</Alert>}
      {success && <Alert color="green" mb="md">{success}</Alert>}
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          {isCounsellorOrAdmin && <Tabs.Tab value="flagged">Flagged Check-ins</Tabs.Tab>}
          <Tabs.Tab value="all">All Check-ins</Tabs.Tab>
          {isCounsellorOrAdmin && <Tabs.Tab value="sessions">Sessions</Tabs.Tab>}
          {isCounsellorOrAdmin && <Tabs.Tab value="analytics">Analytics</Tabs.Tab>}
        </Tabs.List>
        {isCounsellorOrAdmin && (
          <Tabs.Panel value="flagged" pt="md">
            {loading ? <Loader /> : (
              <Stack>
                {flagged.length === 0 && <Text c="dimmed">No flagged check-ins.</Text>}
                {flagged.map(renderCheckin)}
              </Stack>
            )}
          </Tabs.Panel>
        )}
        <Tabs.Panel value="all" pt="md">
          {loading ? <Loader /> : (
            <Stack>
              {all.length === 0 && <Text c="dimmed">No check-ins found.</Text>}
              {all.map(renderCheckin)}
            </Stack>
          )}
        </Tabs.Panel>
        {isCounsellorOrAdmin && (
          <Tabs.Panel value="sessions" pt="md">
            {loading ? <Loader /> : (
              <Stack>
                {sessions.length === 0 && <Text c="dimmed">No sessions found.</Text>}
                {sessions.map(renderSession)}
              </Stack>
            )}
          </Tabs.Panel>
        )}
        {isCounsellorOrAdmin && (
          <Tabs.Panel value="analytics" pt="md">
            <Title order={3} mb="sm">Wellness Trends (Last 30 Days)</Title>
            {trendsLoading ? <Loader /> : trendsError ? <Alert color="red">{trendsError}</Alert> : (
              <>
                <Bar
                  data={{
                    labels: Object.keys(trends?.mood_counts || {}),
                    datasets: [
                      {
                        label: 'Mood Count',
                        data: Object.values(trends?.mood_counts || {}),
                        backgroundColor: '#fa5252',
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
          </Tabs.Panel>
        )}
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
      <Drawer
        opened={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        title="Student Check-in History"
        padding="md"
        size="md"
      >
        {loading ? <Loader /> : (
          <Stack>
            {studentHistory.length === 0 && <Text c="dimmed">No check-ins found for this student.</Text>}
            {studentHistory.map(item => (
              <Paper key={item.id} p="md" shadow="xs" radius="md" withBorder mb="sm">
                <Group justify="space-between">
                  <Text size="xl">{MOOD_EMOJIS[item.mood] || item.mood}</Text>
                  <Text c="dimmed">{new Date(item.created_at).toLocaleDateString()}</Text>
                  {item.flagged && <Badge color="red">Flagged</Badge>}
                </Group>
                {item.notes && <Text mt="xs">{item.notes}</Text>}
              </Paper>
            ))}
          </Stack>
        )}
      </Drawer>
      <Modal opened={actionModal.open} onClose={() => setActionModal({ open: false, type: '', session: null })} title={
        actionModal.type === 'approve' ? 'Approve Session' :
        actionModal.type === 'reject' ? 'Reject Session' :
        actionModal.type === 'reschedule' ? 'Reschedule Session' : ''
      }>
        <Stack>
          {actionModal.type === 'approve' && (
            <>
              <Text>Pick a scheduled time for the session:</Text>
              <input
                type="datetime-local"
                value={actionTime}
                onChange={e => setActionTime(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
            </>
          )}
          {actionModal.type === 'reject' && (
            <Textarea
              label="Rejection Notes (optional)"
              value={actionNotes}
              onChange={e => setActionNotes(e.target.value)}
            />
          )}
          {actionModal.type === 'reschedule' && (
            <>
              <Text>Pick a new scheduled time:</Text>
              <input
                type="datetime-local"
                value={actionTime}
                onChange={e => setActionTime(e.target.value)}
                style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
              />
              <Textarea
                label="Reschedule Reason"
                value={actionReason}
                onChange={e => setActionReason(e.target.value)}
              />
            </>
          )}
          <Button onClick={handleSessionAction} disabled={actionModal.type === 'approve' && !actionTime}>
            {actionModal.type === 'approve' ? 'Approve' :
             actionModal.type === 'reject' ? 'Reject' :
             actionModal.type === 'reschedule' ? 'Reschedule' : 'Submit'}
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
} 