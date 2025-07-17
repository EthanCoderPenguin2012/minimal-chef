import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AddShoppingItem: React.FC = () => {
  const navigate = useNavigate();
  const [item, setItem] = useState({
    name: '',
    quantity: '',
    category: '',
    notes: '',
    priority: 'normal'
  });
  const [success, setSuccess] = useState(false);

  const categories = [
    'Produce', 'Meat & Seafood', 'Dairy', 'Pantry', 'Frozen', 
    'Bakery', 'Beverages', 'Snacks', 'Health & Beauty', 'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'default' as const },
    { value: 'normal', label: 'Normal', color: 'primary' as const },
    { value: 'high', label: 'High', color: 'warning' as const },
    { value: 'urgent', label: 'Urgent', color: 'error' as const }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item.name && item.category) {
      console.log('Adding item:', item);
      setSuccess(true);
      setTimeout(() => {
        navigate('/shopping');
      }, 1500);
    }
  };

  const quickAdd = (itemName: string, category: string) => {
    setItem({ ...item, name: itemName, category });
  };

  const commonItems = [
    { name: 'Milk', category: 'Dairy' },
    { name: 'Bread', category: 'Bakery' },
    { name: 'Eggs', category: 'Dairy' },
    { name: 'Bananas', category: 'Produce' },
    { name: 'Chicken Breast', category: 'Meat & Seafood' },
    { name: 'Rice', category: 'Pantry' },
    { name: 'Olive Oil', category: 'Pantry' },
    { name: 'Tomatoes', category: 'Produce' }
  ];

  if (success) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Item added to shopping list successfully!
        </Alert>
        <Typography variant="h6">Redirecting to shopping list...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add Shopping Item
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Item Name"
                  value={item.name}
                  onChange={(e) => setItem({ ...item, name: e.target.value })}
                  sx={{ mb: 2 }}
                  required
                />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Quantity"
                      value={item.quantity}
                      onChange={(e) => setItem({ ...item, quantity: e.target.value })}
                      placeholder="e.g., 2 lbs, 1 gallon"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Category</InputLabel>
                      <Select
                        value={item.category}
                        onChange={(e) => setItem({ ...item, category: e.target.value })}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={item.priority}
                    onChange={(e) => setItem({ ...item, priority: e.target.value })}
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes (optional)"
                  value={item.notes}
                  onChange={(e) => setItem({ ...item, notes: e.target.value })}
                  sx={{ mb: 3 }}
                  placeholder="Brand preferences, special instructions..."
                />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<Add />}
                    disabled={!item.name || !item.category}
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/shopping')}
                  >
                    Cancel
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Add Common Items
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {commonItems.map((commonItem) => (
                  <Chip
                    key={commonItem.name}
                    label={commonItem.name}
                    onClick={() => quickAdd(commonItem.name, commonItem.category)}
                    clickable
                    variant={item.name === commonItem.name ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Priority
              </Typography>
              <Chip
                label={priorities.find(p => p.value === item.priority)?.label}
                color={priorities.find(p => p.value === item.priority)?.color || 'default'}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {item.priority === 'urgent' && 'Need this ASAP!'}
                {item.priority === 'high' && 'Important item to get'}
                {item.priority === 'normal' && 'Regular shopping item'}
                {item.priority === 'low' && 'Get when convenient'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddShoppingItem;