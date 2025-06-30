import React, { useState } from 'react';
import { Box, Title, Group, Text, Button, NumberInput, Alert, Divider } from '@mantine/core';
import { useCart } from './CartContext';

function formatZAR(amount) {
  return 'R ' + Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 });
}

export default function Cart() {
  const { cart, setCart } = useCart();
  const [checkoutSuccess, setCheckoutSuccess] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const [loading, setLoading] = useState(false);

  const updateQuantity = (id, quantity) => {
    setCart(cart => cart.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const removeItem = (id) => {
    setCart(cart => cart.filter(item => item.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    setCheckoutSuccess('');
    setCheckoutError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('access');
      // For demo: assign all orders to 'cafeteria' department
      const res = await fetch('http://localhost:8000/api/orders/orders/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          department: 'cafeteria',
          total_price: total,
          items: cart.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            price_at_order: item.price,
          })),
        }),
      });
      if (!res.ok) throw new Error('Failed to place order');
      setCheckoutSuccess('Order placed successfully!');
      setCart([]);
    } catch (err) {
      setCheckoutError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maw={600} mx="auto" my="xl">
      <Title order={2} mb="md">Cart</Title>
      {checkoutSuccess && <Alert color="green" mb="md">{checkoutSuccess}</Alert>}
      {checkoutError && <Alert color="red" mb="md">{checkoutError}</Alert>}
      {cart.length === 0 ? (
        <Text c="dimmed">Your cart is empty.</Text>
      ) : (
        <>
          {cart.map(item => (
            <Group key={item.id} justify="space-between" mb="xs">
              <Text>{item.name}</Text>
              <NumberInput
                value={item.quantity}
                min={1}
                max={99}
                onChange={val => updateQuantity(item.id, val)}
                style={{ width: 80 }}
              />
              <Text>{formatZAR(item.price * item.quantity)}</Text>
              <Button size="xs" color="red" onClick={() => removeItem(item.id)}>Remove</Button>
            </Group>
          ))}
          <Divider my="md" />
          <Group justify="space-between">
            <Text fw={700}>Total:</Text>
            <Text fw={700}>{formatZAR(total)}</Text>
          </Group>
          <Button fullWidth mt="md" onClick={handleCheckout} loading={loading} disabled={cart.length === 0}>
            Checkout
          </Button>
        </>
      )}
    </Box>
  );
} 