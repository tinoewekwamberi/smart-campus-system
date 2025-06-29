import { 
  Grid, 
  Card, 
  Text, 
  Group, 
  Badge, 
  Button, 
  Progress, 
  Stack,
  Title,
  Table,
  Avatar,
  List,
  ThemeIcon
} from '@mantine/core';
import { 
  IconBook, 
  IconUsers, 
  IconCalendar, 
  IconChartBar,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconSchool,
  IconCertificate
} from '@tabler/icons-react';

export default function LecturerDashboard({ user }) {
  // Mock data inspired by Richfield's IT curriculum
  const mockData = {
    totalStudents: 156,
    activeCourses: 4,
    averageClassSize: 39,
    upcomingClasses: [
      { course: 'IT 201 - AWS Cloud Computing', time: '09:00 AM', students: 42, room: 'Lab 3' },
      { course: 'IT 301 - CISCO Networking', time: '11:00 AM', students: 38, room: 'Lab 1' },
      { course: 'IT 401 - IBM Data Analytics', time: '02:00 PM', students: 35, room: 'Lab 2' },
    ],
    pendingGrading: [
      { course: 'IT 201', assignment: 'AWS Cloud Project', submissions: 38, dueDate: '2024-01-10' },
      { course: 'IT 301', assignment: 'Network Configuration', submissions: 42, dueDate: '2024-01-12' },
      { course: 'IT 401', assignment: 'Data Analysis Report', submissions: 35, dueDate: '2024-01-15' },
    ],
    coursePerformance: [
      { course: 'IT 101 - Programming Fundamentals', avgGrade: 87, completion: 94, certifications: 89 },
      { course: 'IT 201 - AWS Cloud Computing', avgGrade: 91, completion: 96, certifications: 92 },
      { course: 'IT 301 - CISCO Networking', avgGrade: 84, completion: 91, certifications: 87 },
      { course: 'IT 401 - IBM Data Analytics', avgGrade: 89, completion: 93, certifications: 90 },
    ],
    recentCertifications: [
      { student: 'John Smith', course: 'IT 201', certification: 'AWS Cloud Practitioner', date: '2024-01-08' },
      { student: 'Sarah Johnson', course: 'IT 301', certification: 'CISCO CCNA', date: '2024-01-07' },
      { student: 'Mike Davis', course: 'IT 401', certification: 'IBM Data Science', date: '2024-01-06' },
    ]
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Welcome, Professor {user?.last_name || user?.username}!</Title>
      
      {/* Overview Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Total Students</Text>
              <IconUsers size={20} />
            </Group>
            <Text size="xl" fw={700} c="blue">
              {mockData.totalStudents}
            </Text>
            <Text size="xs" c="dimmed">
              Across all IT courses
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Active Courses</Text>
              <IconBook size={20} />
            </Group>
            <Text size="xl" fw={700} c="green">
              {mockData.activeCourses}
            </Text>
            <Text size="xs" c="dimmed">
              This semester
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Avg Class Size</Text>
              <IconUsers size={20} />
            </Group>
            <Text size="xl" fw={700} c="orange">
              {mockData.averageClassSize}
            </Text>
            <Text size="xs" c="dimmed">
              Students per class
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Certification Rate</Text>
              <IconCertificate size={20} />
            </Group>
            <Text size="xl" fw={700} c="purple">
              89%
            </Text>
            <Text size="xs" c="dimmed">
              Industry certifications
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Main Content */}
      <Grid>
        {/* Today's Classes */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Today's IT Classes</Title>
              <IconCalendar size={20} />
            </Group>
            <Stack gap="sm">
              {mockData.upcomingClasses.map((classInfo, index) => (
                <Group key={index} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                  <div>
                    <Text fw={500} size="sm">{classInfo.course}</Text>
                    <Text size="xs" c="dimmed">Room {classInfo.room} • {classInfo.students} students</Text>
                  </div>
                  <Badge color="blue" variant="light">
                    {classInfo.time}
                  </Badge>
                </Group>
              ))}
            </Stack>
            <Button variant="subtle" fullWidth mt="md">
              View Full Schedule
            </Button>
          </Card>
        </Grid.Col>

        {/* Pending Grading */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Pending Grading</Title>
              <IconChartBar size={20} />
            </Group>
            <Stack gap="sm">
              {mockData.pendingGrading.map((assignment, index) => (
                <Group key={index} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                  <div>
                    <Text fw={500} size="sm">{assignment.course}</Text>
                    <Text size="xs" c="dimmed">{assignment.assignment}</Text>
                  </div>
                  <Group gap="xs">
                    <Badge color="orange" variant="light">
                      {assignment.submissions} submissions
                    </Badge>
                    <Text size="xs" c="dimmed">Due: {assignment.dueDate}</Text>
                  </Group>
                </Group>
              ))}
            </Stack>
            <Button variant="subtle" fullWidth mt="md">
              Grade Assignments
            </Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Course Performance */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">IT Course Performance</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Course</Table.Th>
              <Table.Th>Avg Grade</Table.Th>
              <Table.Th>Completion Rate</Table.Th>
              <Table.Th>Certification Rate</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockData.coursePerformance.map((course, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Text fw={500}>{course.course}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={course.avgGrade >= 90 ? 'green' : course.avgGrade >= 80 ? 'blue' : 'orange'}>
                    {course.avgGrade}%
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Progress value={course.completion} size="sm" />
                  <Text size="xs" c="dimmed">{course.completion}%</Text>
                </Table.Td>
                <Table.Td>
                  <Progress value={course.certifications} size="sm" color="purple" />
                  <Text size="xs" c="dimmed">{course.certifications}%</Text>
                </Table.Td>
                <Table.Td>
                  <Button size="xs" variant="light">View Details</Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Recent Certifications */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">Recent Student Certifications</Title>
        <Grid>
          {mockData.recentCertifications.map((cert, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 4 }}>
              <Card withBorder p="md">
                <Group mb="xs">
                  <Avatar size="sm" color="blue">
                    {cert.student.split(' ').map(n => n[0]).join('')}
                  </Avatar>
                  <div>
                    <Text fw={500} size="sm">{cert.student}</Text>
                    <Text size="xs" c="dimmed">{cert.course}</Text>
                  </div>
                </Group>
                <Badge color="green" variant="light" mb="xs">
                  {cert.certification}
                </Badge>
                <Text size="xs" c="dimmed">Achieved: {cert.date}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Card>

      {/* Quick Actions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">Quick Actions</Title>
        <Group>
          <Button leftSection={<IconBook size={16} />} variant="light" color="blue">
            Manage IT Courses
          </Button>
          <Button leftSection={<IconChartBar size={16} />} variant="light" color="green">
            Grade Assignments
          </Button>
          <Button leftSection={<IconCertificate size={16} />} variant="light" color="purple">
            Track Certifications
          </Button>
          <Button leftSection={<IconUsers size={16} />} variant="light" color="orange">
            Student Directory
          </Button>
        </Group>
      </Card>
    </Stack>
  );
} 