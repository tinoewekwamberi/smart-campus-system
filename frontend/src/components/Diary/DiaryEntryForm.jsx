import React, { useState } from 'react';
import axios from 'axios';
import { Card, Title, TextInput, Textarea, Button, Stack, Loader, Text } from '@mantine/core';

const DiaryEntryForm = ({ onSubmit, initialData }) => {
  const [title, setTitle] = useState(initialData ? initialData.title : '');
  const [content, setContent] = useState(initialData ? initialData.content : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access');
      if (initialData && initialData.id) {
        await axios.patch(`http://localhost:8000/api/diary/diary-entries/${initialData.id}/`, {
          title,
          content,
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        await axios.post('http://localhost:8000/api/diary/diary-entries/', {
          title,
          content,
        }, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      if (onSubmit) onSubmit();
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Failed to save diary entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <form onSubmit={handleSubmit}>
        <Title order={3}>{initialData ? 'Edit Entry' : 'New Diary Entry'}</Title>
        <Stack>
          <TextInput label="Title" placeholder="Entry title" value={title} onChange={e => setTitle(e.target.value)} required />
          <Textarea label="Content" placeholder="Write your thoughts..." minRows={5} value={content} onChange={e => setContent(e.target.value)} required />
          {error && <Text color="red">{error}</Text>}
          <Button mt="md" type="submit" loading={loading} disabled={loading}>{initialData ? 'Update' : 'Add Entry'}</Button>
        </Stack>
      </form>
    </Card>
  );
};

export default DiaryEntryForm; 