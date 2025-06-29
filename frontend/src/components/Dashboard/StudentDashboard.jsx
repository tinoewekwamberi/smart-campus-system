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
  RingProgress,
  List,
  ThemeIcon
} from '@mantine/core';
import { 
  IconBook, 
  IconChartBar, 
  IconCalendar, 
  IconHeart,
  IconCheck,
  IconClock,
  IconAlertCircle
} from '@tabler/icons-react';

export default function StudentDashboard({ user }) {
  // Mock data inspired by Richfield's IT curriculum
  const mockData = {
    currentGPA: 3.85,
    totalCredits: 78,
    requiredCredits: 120,
    enrolledCourses: 5,
    upcomingAssignments: [
      { course: 'IT 201', assignment: 'AWS Cloud Computing Project', dueDate: '2024-01-15' },
      { course: 'IT 301', assignment: 'CISCO Network Configuration', dueDate: '2024-01-12' },
      { course: 'IT 401', assignment: 'IBM Data Analytics Report', dueDate: '2024-01-18' },
    ],
    recentGrades: [
      { course: 'IT 101', grade: 'A', score: 94, badge: 'IBM Certified' },
      { course: 'IT 201', grade: 'A-', score: 91, badge: 'AWS Certified' },
      { course: 'IT 301', grade: 'B+', score: 87, badge: 'CISCO Certified' },
    ],
    wellnessStatus: 'Excellent',
    lastCheckIn: '2024-01-08',
    industryCertifications: [
      { name: 'IBM Data Science', status: 'Completed', date: '2024-01-05' },
      { name: 'AWS Cloud Practitioner', status: 'In Progress', date: '2024-01-10' },
      { name: 'CISCO CCNA', status: 'Enrolled', date: '2024-01-15' },
    ]
  };

  const creditProgress = (mockData.totalCredits / mockData.requiredCredits) * 100;

  return (
    <Stack gap="lg">
      <Title order={2}>Welcome back, {user?.first_name || user?.username}!</Title>
      
      {/* Overview Cards */}
      <Grid>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Current GPA</Text>
              <IconChartBar size={20} />
            </Group>
            <Text size="xl" fw={700} c="blue">
              {mockData.currentGPA}
            </Text>
            <Text size="xs" c="dimmed">
              Excellent standing
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Credits Progress</Text>
              <IconBook size={20} />
            </Group>
            <Group align="flex-end" gap="xs">
              <Text size="xl" fw={700}>
                {mockData.totalCredits}
              </Text>
              <Text size="sm" c="dimmed">
                / {mockData.requiredCredits}
              </Text>
            </Group>
            <Progress value={creditProgress} size="sm" mt="xs" />
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>IT Courses</Text>
              <IconBook size={20} />
            </Group>
            <Text size="xl" fw={700} c="green">
              {mockData.enrolledCourses}
            </Text>
            <Text size="xs" c="dimmed">
              This semester
            </Text>
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="xs">
              <Text fw={500}>Wellness Status</Text>
              <IconHeart size={20} />
            </Group>
            <Badge color="green" size="lg">
              {mockData.wellnessStatus}
            </Badge>
            <Text size="xs" c="dimmed" mt="xs">
              Last check-in: {mockData.lastCheckIn}
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Main Content */}
      <Grid>
        {/* Upcoming Assignments */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Upcoming IT Projects</Title>
              <IconCalendar size={20} />
            </Group>
            <Stack gap="sm">
              {mockData.upcomingAssignments.map((assignment, index) => (
                <Group key={index} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                  <div>
                    <Text fw={500} size="sm">{assignment.course}</Text>
                    <Text size="xs" c="dimmed">{assignment.assignment}</Text>
                  </div>
                  <Badge color="orange" variant="light">
                    Due: {assignment.dueDate}
                  </Badge>
                </Group>
              ))}
            </Stack>
            <Button variant="subtle" fullWidth mt="md">
              View All Projects
            </Button>
          </Card>
        </Grid.Col>

        {/* Recent Grades with Certifications */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Title order={3}>Recent Grades & Certifications</Title>
              <IconChartBar size={20} />
            </Group>
            <Stack gap="sm">
              {mockData.recentGrades.map((grade, index) => (
                <Group key={index} justify="space-between" p="xs" bg="gray.0" style={{ borderRadius: 8 }}>
                  <div>
                    <Text fw={500} size="sm">{grade.course}</Text>
                    <Text size="xs" c="dimmed">{grade.badge}</Text>
                  </div>
                  <Group gap="xs">
                    <Badge color={grade.score >= 90 ? 'green' : grade.score >= 80 ? 'blue' : 'orange'}>
                      {grade.grade}
                    </Badge>
                    <Text size="xs" c="dimmed">{grade.score}%</Text>
                  </Group>
                </Group>
              ))}
            </Stack>
            <Button variant="subtle" fullWidth mt="md">
              View All Grades
            </Button>
          </Card>
        </Grid.Col>
      </Grid>

      {/* Industry Certifications */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">Industry Certifications</Title>
        <Grid>
          {mockData.industryCertifications.map((cert, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 4 }}>
              <Card withBorder p="md">
                <Group justify="space-between" mb="xs">
                  <Text fw={500} size="sm">{cert.name}</Text>
                  <Badge 
                    color={cert.status === 'Completed' ? 'green' : cert.status === 'In Progress' ? 'blue' : 'orange'}
                    variant="light"
                  >
                    {cert.status}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed">Started: {cert.date}</Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Card>

      {/* Quick Actions */}
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Title order={3} mb="md">Quick Actions</Title>
        <Group>
          <Button leftSection={<IconHeart size={16} />} variant="light" color="pink">
            Wellness Check-in
          </Button>
          <Button leftSection={<IconBook size={16} />} variant="light" color="blue">
            View IT Courses
          </Button>
          <Button leftSection={<IconChartBar size={16} />} variant="light" color="green">
            Check Certifications
          </Button>
          <Button leftSection={<IconCalendar size={16} />} variant="light" color="orange">
            Academic Calendar
          </Button>
        </Group>
      </Card>
    </Stack>
  );
} 