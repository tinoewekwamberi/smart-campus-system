import React, { useState } from 'react';
import {
  Stack,
  Title,
  TextInput,
  Button,
  Alert,
  PasswordInput,
  Group,
  Divider,
  Text,
} from '@mantine/core';
import { IconLock, IconEye, IconEyeOff } from '@tabler/icons-react';

const AccountSettingsTab = ({ user, onPasswordChange, onProfileUpdate }) => {
  const [passwords, setPasswords] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordChange = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwords.new_password !== passwords.confirm_password) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwords.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('access');
      const response = await fetch('http://localhost:8000/api/users/profile/change_password/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwords.current_password,
          new_password: passwords.new_password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to change password');
      }

      setSuccess('Password changed successfully!');
      setPasswords({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      onPasswordChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <Title order={3}>Account Settings</Title>
      
      {error && (
        <Alert color="red" title="Error" variant="filled">
          {error}
        </Alert>
      )}

      {success && (
        <Alert color="green" title="Success" variant="filled">
          {success}
        </Alert>
      )}

      {/* Account Information */}
      <Stack gap="md">
        <Title order={4}>Account Information</Title>
        <Group grow>
          <TextInput
            label="Email"
            value={user.email}
            disabled
            description="Email cannot be changed"
          />
          <TextInput
            label="Username"
            value={user.username}
            disabled
            description="Username cannot be changed"
          />
        </Group>
        <TextInput
          label="Role"
          value={user.role}
          disabled
          description="Role is assigned by administrators"
        />
      </Stack>

      <Divider />

      {/* Change Password */}
      <Stack gap="md">
        <Title order={4}>Change Password</Title>
        <form onSubmit={handlePasswordSubmit}>
          <Stack gap="md">
            <PasswordInput
              label="Current Password"
              placeholder="Enter your current password"
              value={passwords.current_password}
              onChange={(e) => handlePasswordChange('current_password', e.target.value)}
              leftSection={<IconLock size={16} />}
              required
            />

            <PasswordInput
              label="New Password"
              placeholder="Enter your new password"
              value={passwords.new_password}
              onChange={(e) => handlePasswordChange('new_password', e.target.value)}
              leftSection={<IconLock size={16} />}
              required
              description="Password must be at least 8 characters long"
            />

            <PasswordInput
              label="Confirm New Password"
              placeholder="Confirm your new password"
              value={passwords.confirm_password}
              onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
              leftSection={<IconLock size={16} />}
              required
            />

            <Group justify="flex-end" mt="md">
              <Button 
                type="submit" 
                loading={loading}
                disabled={!passwords.current_password || !passwords.new_password || !passwords.confirm_password}
              >
                Change Password
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>

      <Divider />

      {/* Security Information */}
      <Stack gap="md">
        <Title order={4}>Security Information</Title>
        <Text size="sm" c="dimmed">
          Your account was created on {new Date(user.date_joined).toLocaleDateString()}.
          Last login: {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
        </Text>
      </Stack>
    </Stack>
  );
};

export default AccountSettingsTab;
