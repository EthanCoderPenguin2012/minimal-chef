import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Alert,
  Chip,
  TextField,
} from '@mui/material';
import { ShoppingCart, Store, LocalShipping } from '@mui/icons-material';

const InstacartIntegration = () => {
  const [connected, setConnected] = useState(false);
  const [zipCode, setZipCode] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  
  const stores = [
    { name: 'Whole Foods Market', distance: '0.8 miles' },
    { name: 'Safeway', distance: '1.2 miles' },
    { name: 'Target', distance: '1.5 miles' },
    { name: 'Costco Wholesale', distance: '2.1 miles' },
  ];

  const pendingOrders = [
    { id: 1, store: 'Whole Foods', items: 8, total: '$67.43', status: 'Shopping' },
    { id: 2, store: 'Safeway', items: 12, total: '$89.21', status: 'Delivered' },
  ];

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Instacart Integration
      </Typography>

      {!connected ? (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Connect to Instacart
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Link your Instacart account to automatically order ingredients from your shopping lists
            </Typography>
            
            <TextField
              fullWidth
              label="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              sx={{ mb: 2 }}
              placeholder="Enter your zip code"
            />
            
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => setConnected(true)}
              disabled={!zipCode}
            >
              Connect Instacart Account
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Alert severity="success" sx={{ mb: 3 }}>
            Successfully connected to Instacart! You can now order ingredients directly from your shopping lists.
          </Alert>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Available Stores
              </Typography>
              <List>
                {stores.map((store, index) => (
                  <ListItem key={index}>
                    <Store sx={{ mr: 2 }} />
                    <ListItemText
                      primary={store.name}
                      secondary={store.distance}
                    />
                    <Button
                      variant={selectedStore === store.name ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setSelectedStore(store.name)}
                    >
                      {selectedStore === store.name ? 'Selected' : 'Select'}
                    </Button>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <List>
                {pendingOrders.map((order) => (
                  <ListItem key={order.id}>
                    <LocalShipping sx={{ mr: 2 }} />
                    <ListItemText
                      primary={`${order.store} - ${order.items} items`}
                      secondary={`Total: ${order.total}`}
                    />
                    <Chip
                      label={order.status}
                      color={order.status === 'Delivered' ? 'success' : 'primary'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Auto-order weekly essentials"
              />
              <FormControlLabel
                control={<Switch />}
                label="Express delivery (1 hour)"
              />
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Substitute unavailable items"
              />
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
};

export default InstacartIntegration;