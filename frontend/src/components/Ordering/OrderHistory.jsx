import React, { useEffect, useState } from 'react';
import { Box, Title, Loader, Alert, Card, Group, Text, Badge, Stack } from '@mantine/core';

function formatZAR(amount) {
  return 'R ' + Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 });
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/orders/orders/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      setOrders(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={800} mx="auto" my="xl">
      <Title order={2} mb="md">Order History</Title>
      {loading ? <Loader /> : error ? <Alert color="red">{error}</Alert> : (
        <Stack>
          {orders.length === 0 ? (
            <Text c="dimmed">No orders found.</Text>
          ) : orders.map(order => (
            <Card key={order.id} shadow="sm" p="md" radius="md" withBorder mb="sm">
              <Group justify="space-between" mb="xs">
                <Text fw={700}>Order #{order.id}</Text>
                <Badge color={order.status === 'completed' ? 'green' : order.status === 'processing' ? 'blue' : order.status === 'pending' ? 'yellow' : 'red'}>{order.status}</Badge>
              </Group>
              <Text size="sm" c="dimmed">{new Date(order.created_at).toLocaleString()}</Text>
              <Text fw={700} mt="xs">Total: {formatZAR(order.total_price)}</Text>
              <Title order={5} mt="sm">Items:</Title>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.product?.name || 'Product'} x {item.quantity} ({formatZAR(item.price_at_order)})
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
} 