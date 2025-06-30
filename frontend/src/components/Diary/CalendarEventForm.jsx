import React, { useState } from 'react';
import axios from 'axios';
import { Card, Title, TextInput, Textarea, Button, Stack, Text } from '@mantine/core';

const CalendarEventForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [description, setDescription] = useState(initialData ? initialData.description : '');
  const [date, setDate] = useState(initialData ? initialData.date : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access');
      if (initialData && initialData.id) {
        await axios.patch(`http://localhost:8000/api/diary/calendar-events/${initialData.id}/`, {
          title,
          description,
          date,
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/diary/calendar-events/', {
          title,
          description,
          date,
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      if (onSubmit) onSubmit();
      setTitle('');
      setDescription('');
      setDate('');
    } catch (err) {
      setError('Failed to save calendar event.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Title order={3}>{initialData ? 'Edit Event' : 'New Calendar Event'}</Title>
        <Stack>
          <TextInput label="Title" placeholder="Event title" value={title} onChange={e => setTitle(e.target.value)} required />
          <Textarea label="Description" placeholder="Event details..." minRows={3} value={description} onChange={e => setDescription(e.target.value)} required />
          <TextInput label="Date" placeholder="YYYY-MM-DD" value={date} onChange={e => setDate(e.target.value)} required />
          {error && <Text color="red">{error}</Text>}
          <Button mt="md" type="submit" loading={loading} disabled={loading}>{initialData ? 'Update' : 'Add Event'}</Button>
        </Stack>
      </form>
    </Card>
  );
};

export default CalendarEventForm; 