import React, { useState } from 'react';
import {
  Stack,
  Title,
  TextInput,
  Button,
  Alert,
  Group,
  Text,
  Badge,
  Card,
  Grid,
  Textarea,
} from '@mantine/core';
import { IconSchool, IconUser, IconShield, IconBook, IconId } from '@tabler/icons-react';

const RoleSpecificTab = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    student_number: user.student_number || '',
    academic_year: user.academic_year || '',
    specialization: user.specialization || '',
    teaching_subjects: user.teaching_subjects || '',
    office_location: user.office_location || '',
    office_hours: user.office_hours || '',
    department_role: user.department_role || '',
    responsibilities: user.responsibilities || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/users/profile/self_profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      onUpdate(updatedUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStudentInfo = () => (
    <Stack gap="lg">
      <Title order={4}>Academic Information</Title>
      
      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Student Number"
            placeholder="Enter your student number"
            value={formData.student_number}
            onChange={(e) => handleInputChange('student_number', e.target.value)}
            leftSection={<IconId size={16} />}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Academic Year"
            placeholder="e.g., 2024"
            value={formData.academic_year}
            onChange={(e) => handleInputChange('academic_year', e.target.value)}
            leftSection={<IconSchool size={16} />}
          />
        </Grid.Col>
      </Grid>

      <TextInput
        label="Specialization/Major"
        placeholder="e.g., Information Technology"
        value={formData.specialization}
        onChange={(e) => handleInputChange('specialization', e.target.value)}
        leftSection={<IconBook size={16} />}
      />

      <Card withBorder p="md">
        <Title order={5} mb="md">Current Academic Status</Title>
        <Group gap="md">
          <Badge color="blue" variant="light">Active Student</Badge>
          <Badge color="green" variant="light">Enrolled</Badge>
        </Group>
      </Card>
    </Stack>
  );

  const renderLecturerInfo = () => (
    <Stack gap="lg">
      <Title order={4}>Teaching Information</Title>
      
      <TextInput
        label="Teaching Subjects"
        placeholder="e.g., Programming, Database Systems, Web Development"
        value={formData.teaching_subjects}
        onChange={(e) => handleInputChange('teaching_subjects', e.target.value)}
        leftSection={<IconBook size={16} />}
      />

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Office Location"
            placeholder="e.g., Building A, Room 101"
            value={formData.office_location}
            onChange={(e) => handleInputChange('office_location', e.target.value)}
            leftSection={<IconUser size={16} />}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Office Hours"
            placeholder="e.g., Mon-Fri 9:00-17:00"
            value={formData.office_hours}
            onChange={(e) => handleInputChange('office_hours', e.target.value)}
            leftSection={<IconUser size={16} />}
          />
        </Grid.Col>
      </Grid>

      <Card withBorder p="md">
        <Title order={5} mb="md">Teaching Status</Title>
        <Group gap="md">
          <Badge color="blue" variant="light">Active Lecturer</Badge>
          <Badge color="green" variant="light">Available for Consultation</Badge>
        </Group>
      </Card>
    </Stack>
  );

  const renderStaffInfo = () => (
    <Stack gap="lg">
      <Title order={4}>Administrative Information</Title>
      
      <TextInput
        label="Department Role"
        placeholder="e.g., IT Support, Academic Advisor, Registrar"
        value={formData.department_role}
        onChange={(e) => handleInputChange('department_role', e.target.value)}
        leftSection={<IconShield size={16} />}
      />

      <Textarea
        label="Responsibilities"
        placeholder="Describe your main responsibilities..."
        value={formData.responsibilities}
        onChange={(e) => handleInputChange('responsibilities', e.target.value)}
        rows={4}
      />

      <Grid>
        <Grid.Col span={6}>
          <TextInput
            label="Office Location"
            placeholder="e.g., Admin Building, Room 205"
            value={formData.office_location}
            onChange={(e) => handleInputChange('office_location', e.target.value)}
            leftSection={<IconShield size={16} />}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TextInput
            label="Office Hours"
            placeholder="e.g., Mon-Fri 8:00-16:00"
            value={formData.office_hours}
            onChange={(e) => handleInputChange('office_hours', e.target.value)}
            leftSection={<IconShield size={16} />}
          />
        </Grid.Col>
      </Grid>

      <Card withBorder p="md">
        <Title order={5} mb="md">Staff Status</Title>
        <Group gap="md">
          <Badge color="blue" variant="light">Active Staff</Badge>
          <Badge color="green" variant="light">Available</Badge>
        </Group>
      </Card>
    </Stack>
  );

  return (
    <Stack gap="lg">
      <Title order={3}>
        {user.role === 'student' ? 'Academic Information' : 
         user.role === 'lecturer' ? 'Teaching Information' : 'Administrative Information'}
      </Title>
      
      {error && (
        <Alert color="red" title="Error" variant="filled">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Stack gap="lg">
          {user.role === 'student' && renderStudentInfo()}
          {user.role === 'lecturer' && renderLecturerInfo()}
          {user.role === 'staff' && renderStaffInfo()}

          <Group justify="flex-end" mt="md">
            <Button 
              type="submit" 
              loading={loading}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default RoleSpecificTab; 