import React, { useEffect, useState } from 'react';
import { Card, Title, Text, Button, Group, Loader, Alert, Grid, Badge, Box } from '@mantine/core';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

function formatZAR(amount) {
  return 'R ' + Number(amount).toLocaleString('en-ZA', { minimumFractionDigits: 2 });
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartSuccess, setCartSuccess] = useState('');
  const { cart, setCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('access');
      const res = await fetch('http://localhost:8000/api/orders/products/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch products');
      setProducts(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    setCartSuccess('');
    setCart((prev) => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setCartSuccess(`${product.name} added to cart!`);
    setTimeout(() => setCartSuccess(''), 1500);
  };

  return (
    <Box maw={1000} mx="auto" my="xl">
      <Title order={2} mb="md">Order Online</Title>
      {cartSuccess && <Alert color="green" mb="md">{cartSuccess}</Alert>}
      {loading ? <Loader /> : error ? <Alert color="red">{error}</Alert> : (
        <Grid>
          {products.length === 0 ? (
            <Text c="dimmed">No products available.</Text>
          ) : products.map(product => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={product.id}>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Group justify="space-between" mb="xs">
                  <Title order={4}>{product.name}</Title>
                  <Badge color="blue" variant="light">{product.category}</Badge>
                </Group>
                <Text size="sm" c="dimmed" mb="xs">{product.description}</Text>
                <Text fw={700} size="lg" mb="sm">{formatZAR(product.price)}</Text>
                <Button fullWidth onClick={() => addToCart(product)}>
                  Add to Cart
                </Button>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
      {/* Cart preview (optional, for next step) */}
      {cart.length > 0 && (
        <Box mt="xl">
          <Button fullWidth color="teal" onClick={() => navigate('/ordering/cart')} mb="sm">
            Go to Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)} items)
          </Button>
          <Title order={4}>Cart Preview</Title>
          {cart.map(item => (
            <Group key={item.id} justify="space-between">
              <Text>{item.name} x {item.quantity}</Text>
              <Text>{formatZAR(item.price * item.quantity)}</Text>
            </Group>
          ))}
        </Box>
      )}
    </Box>
  );
} 