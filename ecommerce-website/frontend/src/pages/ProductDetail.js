import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  Typography,
  Button,
  Box,
  Rating,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  ShoppingCart,
  ArrowBack,
  Star,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await productAPI.getProduct(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product.id, quantity);
    if (result.success) {
      // You could show a success message here
      console.log('Item added to cart');
    } else {
      alert(result.message);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setReviewError('');
      await productAPI.addReview(id, reviewForm);
      setReviewSuccess('Review submitted successfully!');
      setReviewForm({ rating: 5, comment: '' });
      // Reload product to get updated reviews
      loadProduct();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Product not found'}
        </Alert>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={product.image_url || 'https://via.placeholder.com/500x500/1976d2/ffffff?text=No+Image'}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
            />
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.name}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating
                value={product.rating}
                readOnly
                precision={0.1}
                size="large"
              />
              <Typography variant="h6" sx={{ ml: 2 }}>
                {product.rating.toFixed(1)} ({product.reviews.length} reviews)
              </Typography>
            </Box>

            <Chip
              label={product.category}
              color="primary"
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <Typography variant="h3" color="primary" sx={{ mb: 2 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </Typography>

            <Divider sx={{ my: 3 }} />

            {/* Add to Cart Section */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography variant="body1">Quantity:</Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: product.stock }}
                  size="small"
                  sx={{ width: 80 }}
                />
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{ width: '100%', py: 1.5 }}
              >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Product Details Tabs */}
      <Box sx={{ mt: 4 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Description" />
          <Tab label="Reviews" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {tabValue === 0 && (
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Description
              </Typography>
              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>
            </Paper>
          )}

          {tabValue === 1 && (
            <Box>
              {/* Review Form */}
              {isAuthenticated && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Write a Review
                  </Typography>
                  <form onSubmit={handleReviewSubmit}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        Rating:
                      </Typography>
                      <Rating
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                        size="large"
                      />
                    </Box>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Your Review"
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      sx={{ mb: 2 }}
                    />
                    {reviewError && (
                      <Alert severity="error" sx={{ mb: 2 }}>
                        {reviewError}
                      </Alert>
                    )}
                    {reviewSuccess && (
                      <Alert severity="success" sx={{ mb: 2 }}>
                        {reviewSuccess}
                      </Alert>
                    )}
                    <Button type="submit" variant="contained">
                      Submit Review
                    </Button>
                  </form>
                </Paper>
              )}

              {/* Reviews List */}
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Customer Reviews ({product.reviews.length})
                </Typography>
                {product.reviews.length === 0 ? (
                  <Typography color="text.secondary">
                    No reviews yet. Be the first to review this product!
                  </Typography>
                ) : (
                  <List>
                    {product.reviews.map((review) => (
                      <ListItem key={review.id} divider>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle1" sx={{ mr: 2 }}>
                                {review.user}
                              </Typography>
                              <Rating value={review.rating} readOnly size="small" />
                              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                {new Date(review.created_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2">
                              {review.comment}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;