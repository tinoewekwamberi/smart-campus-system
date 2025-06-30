import React, { useState } from 'react';
import {
  TextInput,
  Textarea,
  Button,
  Group,
  Stack,
  Title,
  Text,
  FileInput,
  Avatar,
  Box,
  Alert,
} from '@mantine/core';
import { IconUpload, IconUser, IconPhone, IconMapPin } from '@tabler/icons-react';

const PersonalInfoTab = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    phone: user.phone || '',
    address: user.address || '',
    department: user.department || '',
    bio: user.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

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

  const handlePictureUpload = async () => {
    if (!profilePicture) return;

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('access');
      const formData = new FormData();
      formData.append('profile_picture', profilePicture);

      const response = await fetch('http://localhost:8000/api/users/profile/upload_picture/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload picture');
      }

      const updatedUser = await response.json();
      onUpdate(updatedUser);
      setProfilePicture(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="lg">
      <Title order={3}>Personal Information</Title>
      
      {error && (
        <Alert color="red" title="Error" variant="filled">
          {error}
        </Alert>
      )}

      {/* Profile Picture Section */}
      <Box>
        <Text size="sm" fw={500} mb="xs">Profile Picture</Text>
        <Group align="end">
          <Avatar 
            src={user.profile_picture} 
            size={80} 
            radius={80}
            alt={`${user.first_name} ${user.last_name}`}
          >
            {user.first_name?.[0]}{user.last_name?.[0]}
          </Avatar>
          <Stack gap="xs">
            <FileInput
              placeholder="Upload new picture"
              accept="image/*"
              leftSection={<IconUpload size={16} />}
              value={profilePicture}
              onChange={setProfilePicture}
              style={{ width: 200 }}
            />
            {profilePicture && (
              <Button 
                size="xs" 
                onClick={handlePictureUpload}
                loading={loading}
              >
                Upload Picture
              </Button>
            )}
          </Stack>
        </Group>
      </Box>

      {/* Personal Information Form */}
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <Group grow>
            <TextInput
              label="First Name"
              placeholder="Enter your first name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              leftSection={<IconUser size={16} />}
              required
            />
            <TextInput
              label="Last Name"
              placeholder="Enter your last name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              leftSection={<IconUser size={16} />}
              required
            />
          </Group>

          <TextInput
            label="Phone Number"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            leftSection={<IconPhone size={16} />}
          />

          <TextInput
            label="Address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            leftSection={<IconMapPin size={16} />}
          />

          <TextInput
            label="Department"
            placeholder="Enter your department"
            value={formData.department}
            onChange={(e) => handleInputChange('department', e.target.value)}
          />

          <Textarea
            label="Bio"
            placeholder="Tell us about yourself..."
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={4}
          />

          <Group justify="flex-end" mt="md">
            <Button 
              type="submit" 
              loading={loading}
              disabled={!formData.first_name || !formData.last_name}
            >
              Save Changes
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default PersonalInfoTab; 