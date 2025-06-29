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
  IconUsers, 
  IconBook, 
  IconCalendar, 
  IconChartBar,
  IconCheck,
  IconClock,
  IconAlertCircle,
  IconSchool,
  IconCertificate,
  IconBuilding,
  IconReportMoney
} from '@tabler/icons-react';

export default function StaffDashboard({ user }) {
  // Mock data inspired by Richfield's administrative operations
  const mockData = {
    totalStudents: 1247,
    totalFaculty: 89,
    totalCourses: 67,
    campusUtilization: 78,
    upcomingEvents: [
      { event: 'IT Career Fair 2024', date: '2024-01-20', attendees: 450, type: 'Career' },
      { event: 'AWS Certification Workshop', date: '2024-01-18', attendees: 120, type: 'Training' },
      { event: 'CISCO Networking Competition', date: '2024-01-25', attendees: 85, type: 'Competition' },
    ],
    pendingRequests: [
      { type: 'Course Registration', student: 'John Smith', course: 'IT 301', status: 'Pending' },
      { type: 'Certification Request', student: 'Sarah Johnson', course: 'IT 201', status: 'Approved' },
      { type: 'Grade Appeal', student: 'Mike Davis', course: 'IT 401', status: 'Under Review' },
    ],
    departmentStats: [
      { department: 'Information Technology', students: 456, courses: 23, faculty: 34, avgGrade: 87 },
      { department: 'Computer Science', students: 389, courses: 18, faculty: 28, avgGrade: 89 },
      { department: 'Data Science', students: 234, courses: 12, faculty: 15, avgGrade: 91 },
      { department: 'Network Engineering', students: 168, courses: 14, faculty: 12, avgGrade: 85 },
    ],
    recentEnrollments: [
      { student: 'Alex Thompson', program: 'BSc IT', date: '2024-01-08', status: 'Enrolled' },
      { student: 'Emma Wilson', program: 'BSc Computer Science', date: '2024-01-07', status: 'Enrolled' },
      { student: 'David Brown', program: 'BSc Data Science', date: '2024-01-06', status: 'Pending' },
    ],
    certificationStats: {
      totalCertifications: 892,
      thisMonth: 67,
      topCertifications: ['AWS Cloud Practitioner', 'CISCO CCNA', 'IBM Data Science']
    }
  };

  return (
    <Stack gap="lg">
      <Title order={2}>Welcome, {user?.first_name || user?.username}!</Title>
      
      {/* Overview Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Total Students</Text>
              <IconUsers size={20} />
            </Group>
            <Text size="xl" fw={700} c="blue">
              {mockData.totalStudents.toLocaleString()}
            </Text>
            <Text size="xs" c="dimmed">
              Across all IT programs
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Faculty Members</Text>
              <IconSchool size={20} />
            </Group>
            <Text size="xl" fw={700} c="green">
              {mockData.totalFaculty}
            </Text>
            <Text size="xs" c="dimmed">
              Teaching staff
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>IT Courses</Text>
              <IconBook size={20} />
            </Group>
            <Text size="xl" fw={700} c="orange">
              {mockData.totalCourses}
            </Text>
            <Text size="xs" c="dimmed">
              Active courses
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Campus Utilization</Text>
              <IconBuilding size={20} />
            </Group>
            <Text size="xl" fw={700} c="purple">
              {mockData.campusUtilization}%
            </Text>
            <Progress value={mockData.campusUtilization} size="sm" mt="xs" />
          </Card>
        </Grid.Col>
      </Grid>

      {/* Main Content */}
      <Grid>
        {/* Upcoming Events */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Upcoming IT Events</Title>
              <IconCalendar size={20} />
            </Group>
            <Stack gap="sm">
              {mockData.upcomingEvents.map((event, index) => (
                <Group key={index} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                  <div>
                    <Text fw={500} size="sm">{event.event}</Text>
                    <Text size="xs" c="dimmed">{event.attendees} attendees</Text>
                  </div>
                  <Group gap="xs">
                    <Badge color={event.type === 'Career' ? 'blue' : event.type === 'Training' ? 'green' : 'orange'}>
                      {event.type}
                    </Badge>
                    <Text size="xs" c="dimmed">{event.date}</Text>
                  </Group>
                </Group>
              ))}
            </Stack>
            <Button variant="subtle" fullWidth mt="md">
              Manage Events
            </Button>
          </Card>
        </Grid.Col>

        {/* Pending Requests */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Pending Requests</Title>
              <IconAlertCircle size={20} />
            </Group>
            <Stack gap="sm">
              {mockData.pendingRequests.map((request, index) => (
                <Group key={index} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                  <div>
                    <Text fw={500} size="sm">{request.type}</Text>
                    <Text size="xs" c="dimmed">{request.student} - {request.course}</Text>
                  </div>
                  <Badge 
                    color={request.status === 'Approved' ? 'green' : request.status === 'Pending' ? 'orange' : 'blue'}
                    variant="light"
                  >
                    {request.status}
                  </Badge>
                </Group>
              ))}
            </Stack>
            <Button variant="subtle" fullWidth mt="md">
              Review Requests
            </Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Department Statistics */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">IT Department Statistics</Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Department</Table.Th>
              <Table.Th>Students</Table.Th>
              <Table.Th>Courses</Table.Th>
              <Table.Th>Faculty</Table.Th>
              <Table.Th>Avg Grade</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {mockData.departmentStats.map((dept, index) => (
              <Table.Tr key={index}>
                <Table.Td>
                  <Text fw={500}>{dept.department}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge variant="light">{dept.students}</Badge>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{dept.courses}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{dept.faculty}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge color={dept.avgGrade >= 90 ? 'green' : dept.avgGrade >= 85 ? 'blue' : 'orange'}>
                    {dept.avgGrade}%
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Button size="xs" variant="light">View Details</Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      {/* Recent Enrollments and Certifications */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">Recent Enrollments</Title>
            <Stack gap="sm">
              {mockData.recentEnrollments.map((enrollment, index) => (
                <Group key={index} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                  <div>
                    <Text fw={500} size="sm">{enrollment.student}</Text>
                    <Text size="xs" c="dimmed">{enrollment.program}</Text>
                  </div>
                  <Group gap="xs">
                    <Badge color={enrollment.status === 'Enrolled' ? 'green' : 'orange'}>
                      {enrollment.status}
                    </Badge>
                    <Text size="xs" c="dimmed">{enrollment.date}</Text>
                  </Group>
                </Group>
              ))}
            </Stack>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={3} mb="md">Certification Overview</Title>
            <Stack gap="md">
              <Group justify="space-between">
                <Text>Total Certifications</Text>
                <Badge size="lg" color="blue">{mockData.certificationStats.totalCertifications}</Badge>
              </Group>
              <Group justify="space-between">
                <Text>This Month</Text>
                <Badge size="lg" color="green">{mockData.certificationStats.thisMonth}</Badge>
              </Group>
              <div>
                <Text size="sm" fw={500} mb="xs">Top Certifications:</Text>
                <List size="sm">
                  {mockData.certificationStats.topCertifications.map((cert, index) => (
                    <List.Item key={index}>
                      <Text size="xs">{cert}</Text>
                    </List.Item>
                  ))}
                </List>
              </div>
            </Stack>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Quick Actions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">Administrative Actions</Title>
        <Group>
          <Button leftSection={<IconUsers size={16} />} variant="light" color="blue">
            Manage Students
          </Button>
          <Button leftSection={<IconBook size={16} />} variant="light" color="green">
            Course Management
          </Button>
          <Button leftSection={<IconCalendar size={16} />} variant="light" color="orange">
            Event Planning
          </Button>
          <Button leftSection={<IconCertificate size={16} />} variant="light" color="purple">
            Certification Tracking
          </Button>
          <Button leftSection={<IconReportMoney size={16} />} variant="light" color="red">
            Financial Reports
          </Button>
        </Group>
      </Card>
    </Stack>
  );
} 