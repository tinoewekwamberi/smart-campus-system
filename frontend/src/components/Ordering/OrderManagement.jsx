import React, { useEffect, useState } from 'react';
import { Box, Title, Loader, Alert, Table, Badge, Group, Text, Stack } from '@mantine/core';

function formatZAR(amount) {
  return 'R ' + Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 });
}

export default function OrderManagement() {
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
    <Box maw={1000} mx="auto" my="xl">
      <Title order={2} mb="md">Order Management</Title>
      {loading ? <Loader /> : error ? <Alert color="red">{error}</Alert> : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order #</Table.Th>
              <Table.Th>User</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Items</Table.Th>
              {/* <Table.Th>Actions</Table.Th> // Blueprint for future status update */}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.length === 0 ? (
              <Table.Tr><Table.Td colSpan={6}><Text c="dimmed">No orders found.</Text></Table.Td></Table.Tr>
            ) : orders.map(order => (
              <Table.Tr key={order.id}>
                <Table.Td>{order.id}</Table.Td>
                <Table.Td>{order.user}</Table.Td>
                <Table.Td>
                  <Badge color={order.status === 'completed' ? 'green' : order.status === 'processing' ? 'blue' : order.status === 'pending' ? 'yellow' : 'red'}>{order.status}</Badge>
                </Table.Td>
                <Table.Td>{formatZAR(order.total_price)}</Table.Td>
                <Table.Td>{new Date(order.created_at).toLocaleString()}</Table.Td>
                <Table.Td>
                  <Stack gap={2}>
                    {order.items.map(item => (
                      <Text size="sm" key={item.id}>{item.product?.name || 'Product'} x {item.quantity}</Text>
                    ))}
                  </Stack>
                </Table.Td>
                {/* <Table.Td>
                  // Blueprint: Add status update dropdown/button here
                </Table.Td> */}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      {/* Blueprint: Add filtering/search, status update, pagination, etc. */}
    </Box>
  );
} 