import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Title, Text, Button, Group, Loader, Stack, ActionIcon, Modal } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import DiaryEntryForm from './DiaryEntryForm';

const DiaryEntryList = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access');
      const res = await axios.get('http://localhost:8000/api/diary/diary-entries/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setEntries(res.data);
    } catch (err) {
      setError('Failed to load diary entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleAddOrEdit = () => {
    setShowForm(false);
    setEditingEntry(null);
    fetchEntries();
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = localStorage.getItem('access');
      await axios.delete(`http://localhost:8000/api/diary/diary-entries/${deleteId}/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setShowDeleteModal(false);
      setDeleteId(null);
      fetchEntries();
    } catch (err) {
      setError('Failed to delete diary entry.');
    }
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={2}>My Diary Entries</Title>
      {loading ? (
        <Loader />
      ) : error ? (
        <Text color="red">{error}</Text>
      ) : entries.length === 0 ? (
        <Text color="dimmed">No diary entries yet.</Text>
      ) : (
        <Stack>
          {entries.map((entry) => (
            <Card key={entry.id} shadow="xs" mb="sm">
              <Group position="apart">
                <Text weight={500}>{entry.title}</Text>
                <Group>
                  <ActionIcon color="blue" onClick={() => handleEdit(entry)}><IconEdit size={18} /></ActionIcon>
                  <ActionIcon color="red" onClick={() => { setDeleteId(entry.id); setShowDeleteModal(true); }}><IconTrash size={18} /></ActionIcon>
                </Group>
              </Group>
              <Text size="sm" color="dimmed">{entry.date}</Text>
              <Text mt="sm">{entry.content}</Text>
            </Card>
          ))}
        </Stack>
      )}
      <Button mt="md" onClick={() => { setShowForm((v) => !v); setEditingEntry(null); }}>{showForm ? 'Close' : 'Add New Entry'}</Button>
      {showForm && (
        <DiaryEntryForm
          onSubmit={handleAddOrEdit}
          initialData={editingEntry}
        />
      )}
      <Modal opened={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Confirm Delete">
        <Text>Are you sure you want to delete this diary entry?</Text>
        <Group mt="md" position="right">
          <Button color="red" onClick={handleDelete}>Delete</Button>
          <Button variant="default" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        </Group>
      </Modal>
    </Card>
  );
};

export default DiaryEntryList; 