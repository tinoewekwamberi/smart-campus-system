import { useState } from 'react';
import { 
  AppShell, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Badge,
  Avatar,
  Menu,
  ActionIcon,
  useMantineTheme
} from '@mantine/core';
import { 
  IconHome, 
  IconBook, 
  IconUsers, 
  IconChartBar, 
  IconSettings, 
  IconLogout,
  IconUser,
  IconBell,
  IconMenu2
} from '@tabler/icons-react';

export default function MainNavbar({ user, onLogout, children }) {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();

  const getRoleColor = (role) => {
    switch (role) {
      case 'student': return 'blue';
      case 'lecturer': return 'green';
      case 'staff': return 'orange';
      default: return 'gray';
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'student': return 'Student';
      case 'lecturer': return 'Lecturer';
      case 'staff': return 'Staff';
      default: return role;
    }
  };

  // Navigation items based on role
  const getNavItems = (role) => {
    const baseItems = [
      { label: 'Dashboard', icon: IconHome, link: '/dashboard' },
      { label: 'Profile', icon: IconUser, link: '/profile' },
    ];

    switch (role) {
      case 'student':
        return [
          ...baseItems,
          { label: 'My Courses', icon: IconBook, link: '/courses' },
          { label: 'My Grades', icon: IconChartBar, link: '/grades' },
          { label: 'Study Plans', icon: IconBook, link: '/study-plans' },
          { label: 'Wellness Check-in', icon: IconUser, link: '/wellness' },
        ];
      
      case 'lecturer':
        return [
          ...baseItems,
          { label: 'My Courses', icon: IconBook, link: '/courses' },
          { label: 'Grade Management', icon: IconChartBar, link: '/grades' },
          { label: 'Student Roster', icon: IconUsers, link: '/students' },
          { label: 'Announcements', icon: IconBell, link: '/announcements' },
        ];
      
      case 'staff':
        return [
          ...baseItems,
          { label: 'User Management', icon: IconUsers, link: '/users' },
          { label: 'Course Management', icon: IconBook, link: '/courses' },
          { label: 'System Reports', icon: IconChartBar, link: '/reports' },
          { label: 'Support Tickets', icon: IconBell, link: '/support' },
        ];
      
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems(user?.role);

  const NavItem = ({ item, onClick }) => (
    <Button
      variant="subtle"
      leftSection={<item.icon size={16} />}
      fullWidth
      justify="left"
      onClick={() => onClick(item.link)}
      styles={{
        root: {
          color: theme.colors.gray[7],
          '&:hover': {
            backgroundColor: theme.colors.gray[1],
          },
        },
      }}
    >
      {item.label}
    </Button>
  );

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ 
        width: 300, 
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <ActionIcon
              variant="subtle"
              onClick={() => setOpened(!opened)}
              display={{ base: 'block', sm: 'none' }}
            >
              <IconMenu2 size={18} />
            </ActionIcon>
            <Text fw={700} size="lg">SCMS</Text>
          </Group>
          
          <Group>
            <Badge color={getRoleColor(user?.role)}>
              {getRoleDisplayName(user?.role)}
            </Badge>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Avatar 
                  color={getRoleColor(user?.role)} 
                  radius="xl"
                  size="sm"
                >
                  {user?.first_name?.[0] || user?.username?.[0] || 'U'}
                </Avatar>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Account</Menu.Label>
                <Menu.Item icon={<IconUser size={14} />}>
                  {user?.first_name} {user?.last_name}
                </Menu.Item>
                <Menu.Item icon={<IconUser size={14} />}>
                  {user?.email}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item 
                  icon={<IconSettings size={14} />}
                  onClick={() => {/* Navigate to settings */}}
                >
                  Settings
                </Menu.Item>
                <Menu.Item 
                  icon={<IconLogout size={14} />}
                  onClick={onLogout}
                  color="red"
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Stack gap="xs">
          <Text size="xs" fw={500} c="dimmed" tt="uppercase" mb="xs">
            Navigation
          </Text>
          {navItems.map((item, index) => (
            <NavItem 
              key={index} 
              item={item} 
              onClick={(link) => {
                console.log(`Navigate to: ${link}`);
                // TODO: Implement navigation
              }}
            />
          ))}
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 