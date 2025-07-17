import { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Restaurant,
  Explore,
  ShoppingCart,
  Settings,
  Add,
  AutoAwesome,
  Receipt,
  Close,
  Mic,
  Link,
  Timer,
  FitnessCenter,
  Casino,
  Login,
  Logout,
  LibraryBooks,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 240;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Recipes', icon: <Restaurant />, path: '/' },
    { text: 'Library', icon: <LibraryBooks />, path: '/library' },
    { text: 'Discover', icon: <Explore />, path: '/discover' },
    { text: 'Shopping List', icon: <ShoppingCart />, path: '/shopping' },
    { text: 'Meal Log', icon: <Receipt />, path: '/meals' },
    { text: 'Voice Chef', icon: <Mic />, path: '/voice-chef' },
    { text: 'Recipe Timer', icon: <Timer />, path: '/timer' },
    { text: 'Nutrition', icon: <FitnessCenter />, path: '/nutrition' },
    { text: 'Recipe Roulette', icon: <Casino />, path: '/roulette' },
  ];

  const speedDialActions = [
    { icon: <Restaurant />, name: 'New Recipe', action: () => navigate('/recipe/new') },
    { icon: <ShoppingCart />, name: 'New Shopping Item', action: () => navigate('/shopping/add') },
    { icon: <AutoAwesome />, name: 'AI Recipe', action: () => navigate('/ai-recipe') },
    { icon: <Link />, name: 'Import Recipe', action: () => navigate('/import') },
    { icon: <Timer />, name: 'Recipe Timer', action: () => navigate('/timer') },
    { icon: <Casino />, name: 'Recipe Roulette', action: () => navigate('/roulette') },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/settings')}>
            <ListItemIcon><Settings /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>
        {user ? (
          <ListItem disablePadding>
            <ListItemButton onClick={logout}>
              <ListItemIcon><Logout /></ListItemIcon>
              <ListItemText primary={`Logout (${user.username})`} />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={() => navigate('/login')}>
              <ListItemIcon><Login /></ListItemIcon>
              <ListItemText primary="Login" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton color="inherit" onClick={() => navigate('/settings')}>
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>

        <Box component="main" sx={{ flexGrow: 1, pt: 8, pb: 7 }}>
          {children}
        </Box>

        <BottomNavigation
          value={location.pathname}
          onChange={(_, newValue) => navigate(newValue)}
          sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        >
          {menuItems.map((item) => (
            <BottomNavigationAction
              key={item.text}
              label={item.text}
              value={item.path}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>

        <SpeedDial
          ariaLabel="Add new item"
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
          icon={<SpeedDialIcon icon={<Add />} openIcon={<Close />} />}
          open={speedDialOpen}
          onOpen={() => setSpeedDialOpen(true)}
          onClose={() => setSpeedDialOpen(false)}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => {
                action.action();
                setSpeedDialOpen(false);
              }}
            />
          ))}
        </SpeedDial>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>

      <SpeedDial
        ariaLabel="Add new item"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon icon={<Add />} openIcon={<Close />} />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => {
              action.action();
              setSpeedDialOpen(false);
            }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default Layout;