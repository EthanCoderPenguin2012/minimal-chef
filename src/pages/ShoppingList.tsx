import React, { useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

interface ShoppingItem {
  id: number;
  text: string;
  checked: boolean;
  category: string;
}

const ShoppingList: React.FC = () => {
  const { t } = useTranslation('shopping');

  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: 1,
      text: 'Spaghetti pasta',
      checked: false,
      category: t('categories.pantry', 'Pantry'),
    },
    {
      id: 2,
      text: 'Fresh basil',
      checked: true,
      category: t('categories.produce', 'Produce'),
    },
    {
      id: 3,
      text: 'Parmesan cheese',
      checked: false,
      category: t('categories.dairy', 'Dairy'),
    },
    {
      id: 4,
      text: 'Chicken breast',
      checked: false,
      category: t('categories.meat', 'Meat'),
    },
  ]);
  const [newItem, setNewItem] = useState('');

  const addItem = () => {
    if (newItem.trim()) {
      setItems([
        ...items,
        {
          id: Date.now(),
          text: newItem.trim(),
          checked: false,
          category: t('categories.other', 'Other'),
        },
      ]);
      setNewItem('');
    }
  };

  const toggleItem = (id: number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const groupedItems = items.reduce(
    (acc: Record<string, ShoppingItem[]>, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category]?.push(item);
      return acc;
    },
    {} as Record<string, ShoppingItem[]>
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title', 'Shopping List')}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder={t('addItem', 'Add new item...')}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
          />
          <Button variant="contained" onClick={addItem} startIcon={<Add />}>
            {t('addItem', 'Add')}
          </Button>
        </Box>
      </Paper>

      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <Paper key={category} sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
            {category}
          </Typography>
          <List>
            {categoryItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <Checkbox
                    checked={item.checked}
                    onChange={() => toggleItem(item.id)}
                  />
                  <ListItemText
                    primary={item.text}
                    sx={{
                      textDecoration: item.checked ? 'line-through' : 'none',
                      opacity: item.checked ? 0.6 : 1,
                    }}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => deleteItem(item.id)}>
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < categoryItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default ShoppingList;
