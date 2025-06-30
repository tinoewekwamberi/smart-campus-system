import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Tabs,
  Box,
  Title,
  Text,
  Avatar,
  Group,
  Button,
  LoadingOverlay,
  Alert,
} from '@mantine/core';
import { IconUser, IconSettings, IconShield, IconSchool } from '@tabler/icons-react';
import PersonalInfoTab from './PersonalInfoTab';
import AccountSettingsTab from './AccountSettingsTab';
import RoleSpecificTab from './RoleSpecificTab';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('access');
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:8000/api/users/profile/self_profile/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setSuccessMessage('Profile updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordChange = () => {
    setSuccessMessage('Password changed successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <Container size="lg" py="xl">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" py="xl">
        <Alert color="red" title="Error" variant="filled">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container size="lg" py="xl">
        <Alert color="yellow" title="No Profile Data" variant="filled">
          Unable to load profile information.
        </Alert>
      </Container>
    );
  }

  const getRoleIcon = () => {
    switch (user.role) {
      case 'student':
        return <IconSchool size={20} />;
      case 'lecturer':
        return <IconUser size={20} />;
      case 'staff':
        return <IconShield size={20} />;
      default:
        return <IconUser size={20} />;
    }
  };

  return (
    <Container size="lg" py="xl">
      {successMessage && (
        <Alert color="green" title="Success" variant="filled" mb="md">
          {successMessage}
        </Alert>
      )}

      <Paper shadow="sm" p="xl" radius="md">
        {/* Profile Header */}
        <Group mb="xl" align="center">
          <Avatar 
            src={user.profile_picture} 
            size={80} 
            radius={80}
            alt={`${user.first_name} ${user.last_name}`}
          >
            {user.first_name?.[0]}{user.last_name?.[0]}
          </Avatar>
          <Box>
            <Title order={2}>{user.first_name} {user.last_name}</Title>
            <Group gap="xs" mt={5}>
              {getRoleIcon()}
              <Text c="dimmed" tt="capitalize">{user.role}</Text>
            </Group>
            <Text c="dimmed" size="sm">{user.email}</Text>
          </Box>
        </Group>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="personal" leftSection={<IconUser size={16} />}>
              Personal Information
            </Tabs.Tab>
            <Tabs.Tab value="account" leftSection={<IconSettings size={16} />}>
              Account Settings
            </Tabs.Tab>
            <Tabs.Tab value={user.role} leftSection={getRoleIcon()}>
              {user.role === 'student' ? 'Academic Info' : 
               user.role === 'lecturer' ? 'Teaching Info' : 'Admin Info'}
            </Tabs.Tab>
          </Tabs.List>

          <Box mt="xl">
            <Tabs.Panel value="personal">
              <PersonalInfoTab 
                user={user} 
                onUpdate={handleProfileUpdate}
              />
            </Tabs.Panel>

            <Tabs.Panel value="account">
              <AccountSettingsTab 
                user={user}
                onPasswordChange={handlePasswordChange}
                onProfileUpdate={handleProfileUpdate}
              />
            </Tabs.Panel>

            <Tabs.Panel value={user.role}>
              <RoleSpecificTab 
                user={user}
                onUpdate={handleProfileUpdate}
              />
            </Tabs.Panel>
          </Box>
        </Tabs>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 