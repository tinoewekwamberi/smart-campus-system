import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Title, Text, Button, Group, Loader, Stack, ActionIcon, Modal } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import CalendarEventForm from './CalendarEventForm';

const CalendarEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access');
      const res = await axios.get('http://localhost:8000/api/diary/calendar-events/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (err) {
      setError('Failed to load calendar events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddOrEdit = () => {
    setShowForm(false);
    setEditingEvent(null);
    fetchEvents();
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`http://localhost:8000/api/diary/calendar-events/${deleteId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchEvents();
    } catch (err) {
      setError('Failed to delete calendar event.');
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2}>My Calendar Events</Title>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text color="red">{error}</Text>
      ) : events.length === 0 ? (
        <Text color="dimmed">No calendar events yet.</Text>
      ) : (
        <Stack>
          {events.map((event) => (
            <Card key={event.id} shadow="xs" mb="sm">
              <Group position="apart">
                <Text weight={500}>{event.title}</Text>
                <Group>
                  <ActionIcon color="blue" onClick={() => handleEdit(event)}><IconEdit size={18} /></ActionIcon>
                  <ActionIcon color="red" onClick={() => { setDeleteId(event.id); setShowDeleteModal(true); }}><IconTrash size={18} /></ActionIcon>
                </Group>
              </Group>
              <Text size="sm" color="dimmed">{event.date}</Text>
              <Text mt="sm">{event.description}</Text>
            </Card>
          ))}
        </Stack>
      )}
      <Button mt="md" onClick={() => { setShowForm((v) => !v); setEditingEvent(null); }}>{showForm ? 'Close' : 'Add New Event'}</Button>
      {showForm && (
        <CalendarEventForm
          onSubmit={handleAddOrEdit}
          initialData={editingEvent}
        />
      )}
      <Modal opened={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
        <Text>Are you sure you want to delete this calendar event?</Text>
        <Group mt="md" position="right">
          <Button color="red" onClick={handleDelete}>Delete</Button>
          <Button variant="default" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </Group>
      </Modal>
    </Card>
  );
};

export default CalendarEventList; 