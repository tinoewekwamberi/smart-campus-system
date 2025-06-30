import React, { useEffect, useState } from 'react';
import { Table, Title, Loader, Alert, Badge, Box, Group, Text, Button, Modal, NumberInput, Textarea } from '@mantine/core';

export default function GradeManagement({ user }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editEnrollment, setEditEnrollment] = useState(null);
  const [editPercentage, setEditPercentage] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/enrollments/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      setEnrollments(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (enr) => {
    setEditEnrollment(enr);
    setEditPercentage(enr.percentage_score || '');
    setEditNotes(enr.notes || '');
    setEditModalOpen(true);
    setSuccess('');
  };

  const handleEditSave = async () => {
    if (!editEnrollment) return;
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch(`http://localhost:8000/api/enrollments/${editEnrollment.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          percentage_score: editPercentage,
          notes: editNotes,
        }),
      });
      if (!res.ok) throw new Error('Failed to update grade');
      setSuccess('Grade updated!');
      setEditModalOpen(false);
      fetchEnrollments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box maw={900} mx="auto" my="xl">
      <Title order={2} mb="md">Grade Management</Title>
      {loading ? <Loader /> : error ? <Alert color="red">{error}</Alert> : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Student</Table.Th>
              <Table.Th>Course</Table.Th>
              <Table.Th>Percentage</Table.Th>
              <Table.Th>Grade</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Notes</Table.Th>
              <Table.Th>Action</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {enrollments.length === 0 ? (
              <Table.Tr><Table.Td colSpan={7}><Text c="dimmed">No enrollments found.</Text></Table.Td></Table.Tr>
            ) : enrollments.map((enr) => (
              <Table.Tr key={enr.id}>
                <Table.Td>{enr.student?.username || '-'}</Table.Td>
                <Table.Td>{enr.course_name || '-'}</Table.Td>
                <Table.Td>{enr.percentage_score !== null ? `${enr.percentage_score}%` : '-'}</Table.Td>
                <Table.Td>
                  <Badge color={enr.grade === 'A' ? 'green' : enr.grade === 'B' ? 'blue' : enr.grade === 'C' ? 'yellow' : enr.grade === 'D' ? 'orange' : enr.grade === 'F' ? 'red' : 'gray'}>
                    {enr.grade || '-'}
                  </Badge>
                </Table.Td>
                <Table.Td>{enr.status}</Table.Td>
                <Table.Td>{enr.notes || '-'}</Table.Td>
                <Table.Td>
                  <Button size="xs" onClick={() => openEditModal(enr)}>Edit</Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      <Modal opened={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Grade">
        <Group direction="column" grow>
          <NumberInput
            label="Percentage Score"
            value={editPercentage}
            onChange={setEditPercentage}
            min={0}
            max={100}
            precision={2}
            step={0.1}
            required
          />
          <Textarea
            label="Notes"
            value={editNotes}
            onChange={e => setEditNotes(e.target.value)}
            minRows={2}
          />
          <Button onClick={handleEditSave} loading={saving} mt="md">Save</Button>
          {success && <Alert color="green" mt="md">{success}</Alert>}
        </Group>
      </Modal>
    </Box>
  );
} 