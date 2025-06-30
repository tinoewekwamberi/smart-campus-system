import React, { useEffect, useState } from 'react';
import { Table, Title, Loader, Alert, Badge, Box, Group, Text } from '@mantine/core';

export default function StudentGrades() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGrades();
  }, []);

  const fetchGrades = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/enrollments/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch grades');
      setGrades(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={800} mx="auto" my="xl">
      <Title order={2} mb="md">My Grades</Title>
      {loading ? <Loader /> : error ? <Alert color="red">{error}</Alert> : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Course Code</Table.Th>
              <Table.Th>Course Name</Table.Th>
              <Table.Th>Percentage</Table.Th>
              <Table.Th>Grade</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Notes</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {grades.length === 0 ? (
              <Table.Tr><Table.Td colSpan={6}><Text c="dimmed">No grades found.</Text></Table.Td></Table.Tr>
            ) : grades.map((enr) => (
              <Table.Tr key={enr.id}>
                <Table.Td>{enr.course_code || '-'}</Table.Td>
                <Table.Td>{enr.course_name || '-'}</Table.Td>
                <Table.Td>{enr.percentage_score !== null ? `${enr.percentage_score}%` : '-'}</Table.Td>
                <Table.Td>
                  <Badge color={enr.grade === 'A' ? 'green' : enr.grade === 'B' ? 'blue' : enr.grade === 'C' ? 'yellow' : enr.grade === 'D' ? 'orange' : enr.grade === 'F' ? 'red' : 'gray'}>
                    {enr.grade || '-'}
                  </Badge>
                </Table.Td>
                <Table.Td>{enr.status}</Table.Td>
                <Table.Td>{enr.notes || '-'}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Box>
  );
} 