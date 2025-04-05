import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  useMediaQuery,
  useTheme,
  Fade,
  Paper,
  Slide,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Enhanced AppBar with subtle gradient and better shadow
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(145deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  transition: 'background 0.3s ease, box-shadow 0.3s ease',
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.drawer + 1,
}));

// Enhanced Search bar styling
const Search = styled('div')(({ theme, focused }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  ...(focused && {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.2)',
  }),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: alpha(theme.palette.common.white, 0.8),
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '28ch',
      },
    },
  },
}));

// Animated Nav Button
const NavButton = styled(Button)(({ theme, active }) => ({
  my: 2,
  marginX: theme.spacing(0.5),
  color: 'white',
  display: 'block',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&::after': {
    content: '""',
    position: 'absolute',
    width: active ? '70%' : '0%',
    height: '3px',
    bottom: '8px',
    left: '15%',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '10px',
    transition: 'width 0.3s ease',
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.05),
    '&::after': {
      width: '70%',
    },
  },
}));

// Badge with animation
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 3,
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '0 4px',
    transition: 'all 0.3s ease',
    animation: 'pulse 1.5s infinite',
    '@keyframes pulse': {
      '0%': {
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 rgba(245, 0, 87, 0.7)',
      },
      '70%': {
        transform: 'scale(1.1)',
        boxShadow: '0 0 0 10px rgba(245, 0, 87, 0)',
      },
      '100%': {
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 rgba(245, 0, 87, 0)',
      },
    },
  },
}));

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for mobile drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // State for nav menu (desktop)
  const [anchorElNav, setAnchorElNav] = useState(null);
  
  // State for user menu
  const [anchorElUser, setAnchorElUser] = useState(null);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  // State for scroll position
  const [scrolled, setScrolled] = useState(false);
  
  // Mock cart count - replace with actual state from your cart
  const cartItemCount = 3;

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleLogout = () => {
    // Your logout logic here
    localStorage.removeItem('token');
    navigate('/auth/login');
    handleCloseUserMenu();
  };
  
  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchFocused(false);
    }
  };
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  // Check if the current path matches a given path
  const isActivePath = (path) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  // Mobile drawer content
  const drawerContent = (
    <Box sx={{ width: 280 }} role="presentation">
      <Box sx={{ 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center',
        background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white'
      }}>
        <Typography variant="h5" component={RouterLink} to="/" sx={{ color: 'white', textDecoration: 'none', fontWeight: 700, mb: 1 }}>
          E-SHOP
        </Typography>
        {isAuthenticated() && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 40, height: 40 }}>
              <AccountCircleIcon />
            </Avatar>
            <Typography variant="body1" sx={{ ml: 1 }}>
              Hello, User
            </Typography>
          </Box>
        )}
      </Box>
      <Divider />
      <List>
        <ListItem 
          button 
          component={RouterLink} 
          to="/" 
          onClick={() => setDrawerOpen(false)}
          selected={isActivePath('/')}
        >
          <ListItemIcon>
            <HomeIcon color={isActivePath('/') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/products" 
          onClick={() => setDrawerOpen(false)}
          selected={isActivePath('/products')}
        >
          <ListItemIcon>
            <CategoryIcon color={isActivePath('/products') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/cart" 
          onClick={() => setDrawerOpen(false)}
          selected={isActivePath('/cart')}
        >
          <ListItemIcon>
            <StyledBadge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon color={isActivePath('/cart') ? 'primary' : 'inherit'} />
            </StyledBadge>
          </ListItemIcon>
          <ListItemText primary="Cart" />
        </ListItem>
        <ListItem 
          button 
          component={RouterLink} 
          to="/wishlist" 
          onClick={() => setDrawerOpen(false)}
          selected={isActivePath('/wishlist')}
        >
          <ListItemIcon>
            <FavoriteIcon color={isActivePath('/wishlist') ? 'primary' : 'inherit'} />
          </ListItemIcon>
          <ListItemText primary="Wishlist" />
        </ListItem>
      </List>
      <Divider />
      {isAuthenticated() ? (
        <List>
          <ListItem 
            button 
            component={RouterLink} 
            to="/dashboard" 
            onClick={() => setDrawerOpen(false)}
            selected={isActivePath('/dashboard')}
          >
            <ListItemIcon>
              <DashboardIcon color={isActivePath('/dashboard') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem 
            button 
            component={RouterLink} 
            to="/orders" 
            onClick={() => setDrawerOpen(false)}
            selected={isActivePath('/orders')}
          >
            <ListItemIcon>
              <DashboardIcon color={isActivePath('/orders') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary="My Orders" />
          </ListItem>
          <ListItem button onClick={() => { handleLogout(); setDrawerOpen(false); }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      ) : (
        <List>
          <ListItem 
            button 
            component={RouterLink} 
            to="/auth/login" 
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItem>
        </List>
      )}
    </Box>
  );

  return (
    <StyledAppBar position="sticky" elevation={scrolled ? 4 : 1} sx={{
      boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.2)' : '0 4px 20px rgba(0, 0, 0, 0.15)',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile menu icon */}
          {isMobile && (
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ 
                mr: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              }
            }}
          >
            E-SHOP
          </Typography>

          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            E-SHOP
          </Typography>

          {/* Desktop navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <NavButton
              component={RouterLink}
              to="/"
              active={isActivePath('/') ? 1 : 0}
              sx={{ my: 2, marginX: 0.5 }}
            >
              Home
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/products"
              active={isActivePath('/products') ? 1 : 0}
              sx={{ my: 2, marginX: 0.5 }}
            >
              Products
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/categories"
              active={isActivePath('/categories') ? 1 : 0}
              sx={{ my: 2, marginX: 0.5 }}
            >
              Categories
            </NavButton>
            <NavButton
              component={RouterLink}
              to="/deals"
              active={isActivePath('/deals') ? 1 : 0}
              sx={{ my: 2, marginX: 0.5 }}
            >
              Deals
            </NavButton>
          </Box>

          {/* Search bar with enhanced styling */}
          <Search focused={searchFocused ? 1 : 0} sx={{
            transition: 'width 0.3s ease-in-out',
            width: searchFocused ? { xs: '100%', sm: '200px', md: '300px' } : { xs: '80%', sm: '180px', md: '200px' },
            animation: searchFocused ? 'pulse 2s infinite' : 'none',
            '@keyframes pulse': {
              '0%': { boxShadow: '0 0 0 0 rgba(255,255,255,0.4)' },
              '70%': { boxShadow: '0 0 0 5px rgba(255,255,255,0)' },
              '100%': { boxShadow: '0 0 0 0 rgba(255,255,255,0)' },
            }
          }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search products…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </Search>

          {/* Notification icon with animation */}
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{
              ml: 1,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
              }
            }}
          >
            <Badge badgeContent={2} color="error" sx={{
              animation: 'notify-bounce 1s ease-in-out infinite alternate',
              '@keyframes notify-bounce': {
                '0%': { transform: 'translateY(0)' },
                '100%': { transform: 'translateY(-3px)' }
              }
            }}>
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Cart icon with enhanced badge */}
          <IconButton 
            component={RouterLink} 
            to="/cart"
            size="large" 
            aria-label="show cart items" 
            color="inherit"
            sx={{
              ml: 1,
              transition: 'transform 0.2s, background 0.3s',
              '&:hover': {
                transform: 'scale(1.1)',
                background: 'rgba(255,255,255,0.1)',
              }
            }}
          >
            <StyledBadge badgeContent={cartItemCount} color="error">
              <ShoppingCartIcon />
            </StyledBadge>
          </IconButton>

          {/* User menu - fixed structure */}
          <Box sx={{ flexGrow: 0, ml: 1 }}>
            {isAuthenticated() ? (
              <>
                <Tooltip title="Account settings">
                  <IconButton 
                    onClick={handleOpenUserMenu} 
                    sx={{ 
                      p: 0,
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        bgcolor: 'secondary.main',
                        border: '2px solid white',
                      }}
                    >
                      <AccountCircleIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
                      mt: 1.5,
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Hello, User</Typography>
                    <Typography variant="body2">user@example.com</Typography>
                  </Box>
                  <MenuItem component={RouterLink} to="/dashboard" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/orders" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">My Orders</Typography>
                  </MenuItem>
                  <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={RouterLink}
                to="/auth/login"
                variant="outlined"
                startIcon={<AccountCircleIcon />}
                sx={{ 
                  color: 'white', 
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        variant="temporary"
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </StyledAppBar>
  );
};

export default Header;
