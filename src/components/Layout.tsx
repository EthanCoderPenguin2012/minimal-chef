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
  Tooltip,
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
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useA11yLanguage } from '../hooks/useA11yLanguage';
import LanguageSelector from './LanguageSelector';

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
  const { t } = useTranslation(['common', 'navigation']);
  const { isRTL } = useLanguage();
  const { ref: layoutRef } = useA11yLanguage();

  const menuItems = [
    {
      text: t('navigation.recipes', 'Recipes'),
      icon: <Restaurant />,
      path: '/',
    },
    {
      text: t('navigation.library', 'Library'),
      icon: <LibraryBooks />,
      path: '/library',
    },
    {
      text: t('navigation.discover', 'Discover'),
      icon: <Explore />,
      path: '/discover',
    },
    {
      text: t('navigation.shopping', 'Shopping List'),
      icon: <ShoppingCart />,
      path: '/shopping',
    },
    {
      text: t('navigation.mealLog', 'Meal Log'),
      icon: <Receipt />,
      path: '/meals',
    },
    {
      text: t('navigation.voiceChef', 'Voice Chef'),
      icon: <Mic />,
      path: '/voice-chef',
    },
    {
      text: t('navigation.recipeTimer', 'Recipe Timer'),
      icon: <Timer />,
      path: '/timer',
    },
    {
      text: t('navigation.nutrition', 'Nutrition'),
      icon: <FitnessCenter />,
      path: '/nutrition',
    },
    {
      text: t('navigation.recipeRoulette', 'Recipe Roulette'),
      icon: <Casino />,
      path: '/roulette',
    },
  ];

  const speedDialActions = [
    {
      icon: <Restaurant />,
      name: t('actions.newRecipe', 'New Recipe'),
      action: () => navigate('/recipe/new'),
    },
    {
      icon: <ShoppingCart />,
      name: t('actions.newShoppingItem', 'New Shopping Item'),
      action: () => navigate('/shopping/add'),
    },
    {
      icon: <AutoAwesome />,
      name: t('actions.aiRecipe', 'AI Recipe'),
      action: () => navigate('/ai-recipe'),
    },
    {
      icon: <Link />,
      name: t('actions.importRecipe', 'Import Recipe'),
      action: () => navigate('/import'),
    },
    {
      icon: <Timer />,
      name: t('actions.recipeTimer', 'Recipe Timer'),
      action: () => navigate('/timer'),
    },
    {
      icon: <Casino />,
      name: t('actions.recipeRoulette', 'Recipe Roulette'),
      action: () => navigate('/roulette'),
    },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
      data-i18n="true"
    >
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box component="h1" sx={{ m: 0, fontSize: '1.5rem' }}>
          {t('appName', 'Minimal Chef')}
        </Box>
      </Box>
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => navigate(item.path)}
              aria-label={item.text}
              data-i18n="true"
            >
              <ListItemIcon
                sx={{
                  minWidth: isRTL ? 'auto' : 56,
                  mr: isRTL ? 2 : 0,
                  ml: isRTL ? 0 : 2,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => navigate('/settings')}
            aria-label={t('navigation.settings', 'Settings')}
            data-i18n="true"
          >
            <ListItemIcon
              sx={{
                minWidth: isRTL ? 'auto' : 56,
                mr: isRTL ? 2 : 0,
                ml: isRTL ? 0 : 2,
              }}
            >
              <Settings />
            </ListItemIcon>
            <ListItemText primary={t('navigation.settings', 'Settings')} />
          </ListItemButton>
        </ListItem>
        {user ? (
          <ListItem disablePadding>
            <ListItemButton
              onClick={logout}
              aria-label={t('auth.logout', 'Logout')}
              data-i18n="true"
            >
              <ListItemIcon
                sx={{
                  minWidth: isRTL ? 'auto' : 56,
                  mr: isRTL ? 2 : 0,
                  ml: isRTL ? 0 : 2,
                }}
              >
                <Logout />
              </ListItemIcon>
              <ListItemText
                primary={`${t('auth.logout', 'Logout')}${user ? ` (${user.username})` : ''}`}
              />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => navigate('/login')}
              aria-label={t('auth.login', 'Login')}
              data-i18n="true"
            >
              <ListItemIcon
                sx={{
                  minWidth: isRTL ? 'auto' : 56,
                  mr: isRTL ? 2 : 0,
                  ml: isRTL ? 0 : 2,
                }}
              >
                <Login />
              </ListItemIcon>
              <ListItemText primary={t('auth.login', 'Login')} />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          // Support RTL layout
          direction: isRTL ? 'rtl' : 'ltr',
        }}
        ref={layoutRef}
        data-i18n="true"
      >
        <AppBar position="fixed">
          <Toolbar>
            <Tooltip title={t('navigation.menu', 'Menu')}>
              <IconButton
                color="inherit"
                edge={isRTL ? 'end' : 'start'}
                onClick={handleDrawerToggle}
                sx={{ mr: isRTL ? 0 : 2, ml: isRTL ? 2 : 0 }}
                aria-label={t('navigation.toggleMenu', 'Toggle menu')}
              >
                <MenuIcon />
              </IconButton>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} />
            <LanguageSelector compact size="small" />
            <Tooltip title={t('navigation.settings', 'Settings')}>
              <IconButton
                color="inherit"
                onClick={() => navigate('/settings')}
                aria-label={t('navigation.settings', 'Settings')}
              >
                <Settings />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              // Support RTL layout
              [isRTL ? 'right' : 'left']: 0,
            },
          }}
          anchor={isRTL ? 'right' : 'left'}
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
          {menuItems.slice(0, 5).map((item) => (
            <BottomNavigationAction
              key={item.text}
              label={item.text}
              value={item.path}
              icon={item.icon}
              aria-label={item.text}
            />
          ))}
        </BottomNavigation>

        <SpeedDial
          ariaLabel={t('actions.addNewItem', 'Add new item')}
          sx={{
            position: 'fixed',
            bottom: 80,
            [isRTL ? 'left' : 'right']: 16,
          }}
          icon={<SpeedDialIcon icon={<Add />} openIcon={<Close />} />}
          open={speedDialOpen}
          onOpen={() => setSpeedDialOpen(true)}
          onClose={() => setSpeedDialOpen(false)}
          direction={isRTL ? 'left' : 'up'}
        >
          {speedDialActions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              aria-label={action.name}
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
    <Box
      sx={{
        display: 'flex',
        direction: isRTL ? 'rtl' : 'ltr',
      }}
      ref={layoutRef}
      data-i18n="true"
    >
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            [isRTL ? 'right' : 'left']: 0,
          },
        }}
        anchor={isRTL ? 'right' : 'left'}
      >
        {drawer}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: isRTL ? 'flex-start' : 'flex-end',
            mb: 2,
          }}
        >
          <LanguageSelector size="small" />
        </Box>
        {children}
      </Box>

      <SpeedDial
        ariaLabel={t('actions.addNewItem', 'Add new item')}
        sx={{
          position: 'fixed',
          bottom: 16,
          [isRTL ? 'left' : 'right']: 16,
        }}
        icon={<SpeedDialIcon icon={<Add />} openIcon={<Close />} />}
        open={speedDialOpen}
        onOpen={() => setSpeedDialOpen(true)}
        onClose={() => setSpeedDialOpen(false)}
        direction={isRTL ? 'left' : 'up'}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            aria-label={action.name}
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
