import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  Text,
  Group,
  Badge,
  Button,
  Stack,
  Title,
  Tabs,
  Table,
  List,
  Alert,
  LoadingOverlay,
  ActionIcon,
  Modal,
  Textarea,
  Select,
  FileInput
} from '@mantine/core';
import {
  IconBook,
  IconUsers,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconDownload,
  IconUpload,
  IconPlus,
  IconEdit,
  IconTrash,
  IconSchool,
  IconCertificate,
  IconFile,
  IconVideo,
  IconLink
} from '@tabler/icons-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CourseDetail({ user }) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMaterialModal, setShowMaterialModal] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    material_type: 'reading',
    description: '',
    file_url: '',
    file_name: ''
  });

  const materialTypes = [
    { value: 'syllabus', label: 'Syllabus' },
    { value: 'lecture_notes', label: 'Lecture Notes' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'reading', label: 'Reading Material' },
    { value: 'video', label: 'Video' },
    { value: 'other', label: 'Other' },
  ];

  const fetchCourseDetail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch course details');
      }

      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetail();
    }
  }, [courseId]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/enroll/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to enroll in course');
      }

      fetchCourseDetail();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDrop = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${API_BASE_URL}/courses/${courseId}/drop/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to drop course');
      }

      fetchCourseDetail();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUploadMaterial = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${API_BASE_URL}/materials/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...materialForm,
          course: courseId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to upload material');
      }

      setShowMaterialModal(false);
      setMaterialForm({
        title: '',
        material_type: 'reading',
        description: '',
        file_url: '',
        file_name: ''
      });
      fetchCourseDetail();
    } catch (err) {
      setError(err.message);
    }
  };

  const getMaterialIcon = (type) => {
    const icons = {
      'syllabus': IconBook,
      'lecture_notes': IconFile,
      'assignment': IconFile,
      'reading': IconFile,
      'video': IconVideo,
      'other': IconLink
    };
    return icons[type] || IconFile;
  };

  const getDayColor = (day) => {
    const colors = {
      'monday': 'blue',
      'tuesday': 'green',
      'wednesday': 'orange',
      'thursday': 'red',
      'friday': 'purple',
      'saturday': 'gray',
      'sunday': 'gray'
    };
    return colors[day] || 'gray';
  };

  if (loading) {
    return (
      <Container size="xl" py="md">
        <LoadingOverlay visible={true} />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="xl" py="md">
        <Alert color="red" title="Error">
          {error}
        </Alert>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container size="xl" py="md">
        <Alert color="yellow" title="Course Not Found">
          The requested course could not be found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Group justify="space-between">
          <div>
            <Button variant="subtle" leftSection={<IconBook size={16} />} onClick={() => navigate('/courses')}>
              Back to Courses
            </Button>
            <Title order={2} mt="xs">{course.code} - {course.name}</Title>
          </div>
          {user?.role === 'student' && (
            <Button 
              variant={course.is_enrolled ? "outline" : "filled"}
              color={course.is_enrolled ? "red" : "blue"}
              onClick={course.is_enrolled ? handleDrop : handleEnroll}
              disabled={!course.is_enrolled && course.is_full}
            >
              {course.is_enrolled ? 'Drop Course' : 'Enroll'}
            </Button>
          )}
        </Group>

        {/* Course Info Cards */}
        <Grid>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Group>
                <IconSchool size={24} />
                <div>
                  <Text size="xs" c="dimmed">Lecturer</Text>
                  <Text fw={500}>{course.lecturer?.first_name} {course.lecturer?.last_name}</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Group>
                <IconUsers size={24} />
                <div>
                  <Text size="xs" c="dimmed">Enrollment</Text>
                  <Text fw={500}>{course.enrollment_count}/{course.max_students}</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Group>
                <IconCalendar size={24} />
                <div>
                  <Text size="xs" c="dimmed">Semester</Text>
                  <Text fw={500}>{course.semester}</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Group>
                <IconCertificate size={24} />
                <div>
                  <Text size="xs" c="dimmed">Credits</Text>
                  <Text fw={500}>{course.credits}</Text>
                </div>
              </Group>
            </Card>
          </Grid.Col>
        </Grid>

        {/* Tabs */}
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="overview" leftSection={<IconBook size={16} />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="schedule" leftSection={<IconCalendar size={16} />}>
              Schedule
            </Tabs.Tab>
            <Tabs.Tab value="materials" leftSection={<IconFile size={16} />}>
              Materials
            </Tabs.Tab>
            {user?.role === 'lecturer' && course.lecturer?.id === user.id && (
              <Tabs.Tab value="enrollments" leftSection={<IconUsers size={16} />}>
                Enrollments
              </Tabs.Tab>
            )}
          </Tabs.List>

          <Tabs.Panel value="overview" pt="md">
            <Grid>
              <Grid.Col span={{ base: 12, md: 8 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Course Description</Title>
                  <Text mb="lg">{course.description}</Text>

                  {course.syllabus && (
                    <div mb="lg">
                      <Title order={4} mb="sm">Syllabus</Title>
                      <Text style={{ whiteSpace: 'pre-line' }}>{course.syllabus}</Text>
                    </div>
                  )}

                  {course.learning_outcomes && (
                    <div>
                      <Title order={4} mb="sm">Learning Outcomes</Title>
                      <Text style={{ whiteSpace: 'pre-line' }}>{course.learning_outcomes}</Text>
                    </div>
                  )}
                </Card>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 4 }}>
                <Card shadow="sm" padding="lg" radius="md" withBorder>
                  <Title order={3} mb="md">Course Details</Title>
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm">Level:</Text>
                      <Badge>{course.level} Level</Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Type:</Text>
                      <Badge>{course.course_type}</Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm">Status:</Text>
                      <Badge color={course.is_active ? 'green' : 'red'}>
                        {course.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Group>
                    {course.is_full && (
                      <Alert color="red" title="Course Full">
                        This course has reached maximum enrollment.
                      </Alert>
                    )}
                  </Stack>
                </Card>
              </Grid.Col>
            </Grid>
          </Tabs.Panel>

          <Tabs.Panel value="schedule" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Course Schedule</Title>
              </Group>
              {course.schedules && course.schedules.length > 0 ? (
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Day</Table.Th>
                      <Table.Th>Time</Table.Th>
                      <Table.Th>Location</Table.Th>
                      <Table.Th>Type</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {course.schedules.map((schedule, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>
                          <Badge color={getDayColor(schedule.day_of_week)}>
                            {schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <IconClock size={14} />
                            {schedule.start_time} - {schedule.end_time}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Group gap="xs">
                            <IconMapPin size={14} />
                            {schedule.room}, {schedule.building}
                          </Group>
                        </Table.Td>
                        <Table.Td>
                          <Badge color={schedule.is_lab ? 'green' : 'blue'}>
                            {schedule.is_lab ? 'Lab' : 'Lecture'}
                          </Badge>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text c="dimmed">No schedule information available.</Text>
              )}
            </Card>
          </Tabs.Panel>

          <Tabs.Panel value="materials" pt="md">
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group justify="space-between" mb="md">
                <Title order={3}>Course Materials</Title>
                {(user?.role === 'lecturer' && course.lecturer?.id === user.id) && (
                  <Button 
                    leftSection={<IconUpload size={16} />}
                    onClick={() => setShowMaterialModal(true)}
                  >
                    Upload Material
                  </Button>
                )}
              </Group>
              {course.materials && course.materials.length > 0 ? (
                <Grid>
                  {course.materials.map((material, index) => {
                    const MaterialIcon = getMaterialIcon(material.material_type);
                    return (
                      <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
                        <Card shadow="sm" padding="md" radius="md" withBorder>
                          <Group mb="xs">
                            <MaterialIcon size={20} />
                            <div style={{ flex: 1 }}>
                              <Text fw={500} size="sm">{material.title}</Text>
                              <Text size="xs" c="dimmed">{material.material_type}</Text>
                            </div>
                          </Group>
                          {material.description && (
                            <Text size="xs" c="dimmed" mb="xs">
                              {material.description}
                            </Text>
                          )}
                          <Group justify="space-between">
                            <Text size="xs" c="dimmed">
                              By {material.uploaded_by?.first_name} {material.uploaded_by?.last_name}
                            </Text>
                            {material.file_url && (
                              <ActionIcon variant="subtle" size="sm">
                                <IconDownload size={14} />
                              </ActionIcon>
                            )}
                          </Group>
                        </Card>
                      </Grid.Col>
                    );
                  })}
                </Grid>
              ) : (
                <Text c="dimmed">No materials available for this course.</Text>
              )}
            </Card>
          </Tabs.Panel>

          {user?.role === 'lecturer' && course.lecturer?.id === user.id && (
            <Tabs.Panel value="enrollments" pt="md">
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Title order={3} mb="md">Student Enrollments</Title>
                {course.enrollments && course.enrollments.length > 0 ? (
                  <Table>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Student</Table.Th>
                        <Table.Th>Email</Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th>Enrolled</Table.Th>
                        <Table.Th>Grade</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {course.enrollments.map((enrollment, index) => (
                        <Table.Tr key={index}>
                          <Table.Td>
                            {enrollment.student?.first_name} {enrollment.student?.last_name}
                          </Table.Td>
                          <Table.Td>{enrollment.student?.email}</Table.Td>
                          <Table.Td>
                            <Badge color={enrollment.status === 'enrolled' ? 'green' : 'orange'}>
                              {enrollment.status}
                            </Badge>
                          </Table.Td>
                          <Table.Td>{new Date(enrollment.enrolled_at).toLocaleDateString()}</Table.Td>
                          <Table.Td>{enrollment.grade || '-'}</Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                ) : (
                  <Text c="dimmed">No students enrolled in this course.</Text>
                )}
              </Card>
            </Tabs.Panel>
          )}
        </Tabs>
      </Stack>

      {/* Upload Material Modal */}
      <Modal
        opened={showMaterialModal}
        onClose={() => setShowMaterialModal(false)}
        title="Upload Course Material"
        size="md"
      >
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Material title"
            value={materialForm.title}
            onChange={(e) => setMaterialForm({ ...materialForm, title: e.target.value })}
            required
          />
          <Select
            label="Type"
            data={materialTypes}
            value={materialForm.material_type}
            onChange={(value) => setMaterialForm({ ...materialForm, material_type: value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Material description"
            value={materialForm.description}
            onChange={(e) => setMaterialForm({ ...materialForm, description: e.target.value })}
          />
          <TextInput
            label="File URL"
            placeholder="https://example.com/file.pdf"
            value={materialForm.file_url}
            onChange={(e) => setMaterialForm({ ...materialForm, file_url: e.target.value })}
          />
          <TextInput
            label="File Name"
            placeholder="document.pdf"
            value={materialForm.file_name}
            onChange={(e) => setMaterialForm({ ...materialForm, file_name: e.target.value })}
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setShowMaterialModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUploadMaterial}>
              Upload Material
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 