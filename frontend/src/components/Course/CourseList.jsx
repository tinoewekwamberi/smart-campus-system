import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextInput,
  Select,
  Pagination,
  Modal,
  Textarea,
  NumberInput,
  MultiSelect,
  LoadingOverlay,
  Alert,
  ActionIcon,
  Menu,
  Tooltip
} from '@mantine/core';
import {
  IconSearch,
  IconFilter,
  IconPlus,
  IconBook,
  IconUsers,
  IconCalendar,
  IconEdit,
  IconTrash,
  IconEye,
  IconDownload,
  IconSchool,
  IconCertificate
} from '@tabler/icons-react';

const API_BASE_URL = 'http://localhost:8000/api';

export default function CourseList({ user }) {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [createForm, setCreateForm] = useState({
    code: '',
    name: '',
    description: '',
    credits: 3,
    level: '100',
    course_type: 'core',
    max_students: 50,
    syllabus: '',
    learning_outcomes: '',
    semester: 'first',
    year: 2024
  });

  const levelOptions = [
    { value: '100', label: '100 Level' },
    { value: '200', label: '200 Level' },
    { value: '300', label: '300 Level' },
    { value: '400', label: '400 Level' },
    { value: '500', label: '500 Level' },
    { value: '600', label: '600 Level' },
  ];

  const typeOptions = [
    { value: 'core', label: 'Core Course' },
    { value: 'elective', label: 'Elective Course' },
    { value: 'lab', label: 'Laboratory Course' },
    { value: 'project', label: 'Project Course' },
    { value: 'seminar', label: 'Seminar Course' },
  ];

  const semesterOptions = [
    { value: 'first', label: 'First Semester' },
    { value: 'second', label: 'Second Semester' },
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access');
      const params = new URLSearchParams({
        page: currentPage,
        search: searchTerm,
        ...(levelFilter && { level: levelFilter }),
        ...(typeFilter && { course_type: typeFilter }),
      });

      const response = await fetch(`${API_BASE_URL}/courses/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }

      const data = await response.json();
      setCourses(data.results || data);
      setTotalPages(Math.ceil((data.count || data.length) / 10));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, searchTerm, levelFilter, typeFilter]);

  const handleCreateCourse = async () => {
    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${API_BASE_URL}/courses/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createForm),
      });

      if (!response.ok) {
        throw new Error('Failed to create course');
      }

      setShowCreateModal(false);
      setCreateForm({
        code: '',
        name: '',
        description: '',
        credits: 3,
        level: '100',
        course_type: 'core',
        max_students: 50,
        syllabus: '',
        learning_outcomes: '',
        semester: 'first',
        year: 2024
      });
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnroll = async (courseId) => {
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

      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDrop = async (courseId) => {
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

      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const getLevelColor = (level) => {
    const colors = {
      '100': 'blue',
      '200': 'green',
      '300': 'orange',
      '400': 'red',
      '500': 'purple',
      '600': 'gray'
    };
    return colors[level] || 'gray';
  };

  const getTypeColor = (type) => {
    const colors = {
      'core': 'red',
      'elective': 'blue',
      'lab': 'green',
      'project': 'orange',
      'seminar': 'purple'
    };
    return colors[type] || 'gray';
  };

  const CourseCard = ({ course }) => (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <div>
          <Text fw={500} size="lg">{course.code}</Text>
          <Text size="sm" c="dimmed">{course.name}</Text>
        </div>
        <Menu>
          <Menu.Target>
            <ActionIcon variant="subtle">
              <IconEdit size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<IconEye size={14} />} onClick={() => navigate(`/courses/${course.id}`)}>
              View Details
            </Menu.Item>
            {user?.role === 'student' && !course.is_enrolled && (
              <Menu.Item 
                icon={<IconBook size={14} />}
                onClick={() => handleEnroll(course.id)}
                disabled={course.is_full}
              >
                Enroll
              </Menu.Item>
            )}
            {user?.role === 'student' && course.is_enrolled && (
              <Menu.Item 
                icon={<IconDownload size={14} />}
                onClick={() => handleDrop(course.id)}
                color="red"
              >
                Drop Course
              </Menu.Item>
            )}
            {user?.role === 'lecturer' && course.lecturer_name === `${user.first_name} ${user.last_name}` && (
              <Menu.Item icon={<IconEdit size={14} />}>
                Edit Course
              </Menu.Item>
            )}
            {user?.role === 'staff' && (
              <Menu.Item icon={<IconTrash size={14} />} color="red">
                Delete Course
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Text size="sm" c="dimmed" mb="md" lineClamp={2}>
        {course.description}
      </Text>

      <Group gap="xs" mb="md">
        <Badge color={getLevelColor(course.level)} variant="light">
          {course.level} Level
        </Badge>
        <Badge color={getTypeColor(course.course_type)} variant="light">
          {course.course_type}
        </Badge>
        <Badge color="blue" variant="light">
          {course.credits} Credits
        </Badge>
        {user?.role === 'student' && course.is_enrolled && (
          <Badge color="green" variant="light">
            Enrolled
          </Badge>
        )}
      </Group>

      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <IconUsers size={16} />
          <Text size="sm">{course.enrollment_count}/{course.max_students}</Text>
        </Group>
        <Group gap="xs">
          <IconSchool size={16} />
          <Text size="sm">{course.lecturer_name}</Text>
        </Group>
      </Group>

      <Group justify="space-between" mb="md">
        <Group gap="xs">
          <IconCalendar size={16} />
          <Text size="sm">{course.semester} {course.year}</Text>
        </Group>
        {course.is_full && (
          <Badge color="red" variant="light">
            Full
          </Badge>
        )}
      </Group>

      <Group>
        {user?.role === 'student' && (
          <Button 
            variant={course.is_enrolled ? "outline" : "filled"}
            color={course.is_enrolled ? "red" : "blue"}
            size="sm"
            fullWidth
            onClick={() => course.is_enrolled ? handleDrop(course.id) : handleEnroll(course.id)}
            disabled={!course.is_enrolled && course.is_full}
          >
            {course.is_enrolled ? 'Drop Course' : 'Enroll'}
          </Button>
        )}
        {user?.role === 'lecturer' && course.lecturer_name === `${user.first_name} ${user.last_name}` && (
          <Button variant="outline" size="sm" fullWidth>
            Manage Course
          </Button>
        )}
        {user?.role === 'staff' && (
          <Button variant="outline" size="sm" fullWidth>
            Admin View
          </Button>
        )}
      </Group>
    </Card>
  );

  return (
    <Container size="xl" py="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>Course Management</Title>
          {(user?.role === 'lecturer' || user?.role === 'staff') && (
            <Button 
              leftSection={<IconPlus size={16} />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Course
            </Button>
          )}
        </Group>

        {error && (
          <Alert color="red" title="Error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Filters */}
        <Card shadow="sm" padding="md" radius="md" withBorder>
          <Group gap="md">
            <TextInput
              placeholder="Search courses..."
              leftSection={<IconSearch size={16} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1 }}
            />
            <Select
              placeholder="Level"
              data={levelOptions}
              value={levelFilter}
              onChange={setLevelFilter}
              clearable
            />
            <Select
              placeholder="Type"
              data={typeOptions}
              value={typeFilter}
              onChange={setTypeFilter}
              clearable
            />
          </Group>
        </Card>

        {/* Course Grid */}
        <div style={{ position: 'relative' }}>
          <LoadingOverlay visible={loading} />
          <Grid>
            {courses.map((course) => (
              <Grid.Col key={course.id} span={{ base: 12, md: 6, lg: 4 }}>
                <CourseCard course={course} />
              </Grid.Col>
            ))}
          </Grid>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="center">
            <Pagination
              total={totalPages}
              value={currentPage}
              onChange={setCurrentPage}
            />
          </Group>
        )}
      </Stack>

      {/* Create Course Modal */}
      <Modal
        opened={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Course"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Course Code"
            placeholder="e.g., IT101"
            value={createForm.code}
            onChange={(e) => setCreateForm({ ...createForm, code: e.target.value })}
            required
          />
          <TextInput
            label="Course Name"
            placeholder="Course name"
            value={createForm.name}
            onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Course description"
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            required
          />
          <Group grow>
            <NumberInput
              label="Credits"
              value={createForm.credits}
              onChange={(value) => setCreateForm({ ...createForm, credits: value })}
              min={1}
              max={6}
              required
            />
            <NumberInput
              label="Max Students"
              value={createForm.max_students}
              onChange={(value) => setCreateForm({ ...createForm, max_students: value })}
              min={1}
              max={200}
              required
            />
          </Group>
          <Group grow>
            <Select
              label="Level"
              data={levelOptions}
              value={createForm.level}
              onChange={(value) => setCreateForm({ ...createForm, level: value })}
              required
            />
            <Select
              label="Type"
              data={typeOptions}
              value={createForm.course_type}
              onChange={(value) => setCreateForm({ ...createForm, course_type: value })}
              required
            />
          </Group>
          <Group grow>
            <Select
              label="Semester"
              data={semesterOptions}
              value={createForm.semester}
              onChange={(value) => setCreateForm({ ...createForm, semester: value })}
              required
            />
            <NumberInput
              label="Year"
              value={createForm.year}
              onChange={(value) => setCreateForm({ ...createForm, year: value })}
              min={2024}
              max={2030}
              required
            />
          </Group>
          <TextInput
            label="Syllabus"
            placeholder="Course syllabus"
            value={createForm.syllabus}
            onChange={(e) => setCreateForm({ ...createForm, syllabus: e.target.value })}
            minRows={3}
          />
          <Textarea
            label="Learning Outcomes"
            placeholder="Learning outcomes"
            value={createForm.learning_outcomes}
            onChange={(e) => setCreateForm({ ...createForm, learning_outcomes: e.target.value })}
            minRows={3}
          />
          <Group justify="flex-end">
            <Button variant="outline" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCourse}>
              Create Course
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
} 