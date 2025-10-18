import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Search,
  Menu as MenuIcon,
  Home,
  Store,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemCount } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const cartItemCount = getCartItemCount();

  const menuItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/', icon: <Store /> },
  ];

  const userMenuItems = [
    { label: 'Profile', path: '/profile' },
    { label: 'Orders', path: '/orders' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileMenuOpen(false);
            }}
          >
            {item.icon}
            <ListItemText primary={item.label} sx={{ ml: 1 }} />
          </ListItem>
        ))}
        {isAuthenticated && userMenuItems.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => {
              navigate(item.path);
              setMobileMenuOpen(false);
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <ListItem
          button
          onClick={() => {
            navigate('/cart');
            setMobileMenuOpen(false);
          }}
        >
          <ShoppingCart />
          <ListItemText primary="Cart" sx={{ ml: 1 }} />
          {cartItemCount > 0 && (
            <Badge badgeContent={cartItemCount} color="secondary" />
          )}
        </ListItem>
        {!isAuthenticated ? (
          <>
            <ListItem
              button
              onClick={() => {
                navigate('/login');
                setMobileMenuOpen(false);
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              onClick={() => {
                navigate('/register');
                setMobileMenuOpen(false);
              }}
            >
              <ListItemText primary="Register" />
            </ListItem>
          </>
        ) : (
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setMobileMenuOpen(true)}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          component="div"
          sx={{ 
            flexGrow: isMobile ? 0 : 1, 
            cursor: 'pointer',
            mr: isMobile ? 2 : 0
          }}
          onClick={() => navigate('/')}
        >
          E-Commerce Store
        </Typography>

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, mx: 4 }}>
            <form onSubmit={handleSearch} style={{ flexGrow: 1, maxWidth: 600 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: 2,
                  },
                }}
              />
            </form>
          </Box>
        )}

        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{ position: 'relative' }}
            >
              <Badge badgeContent={cartItemCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                <IconButton
                  color="inherit"
                  onClick={handleMenuOpen}
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleMenuClose(); }}>
                    Orders
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </Box>
        )}

        {isMobile && (
          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            sx={{ position: 'relative' }}
          >
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
        )}
      </Toolbar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;