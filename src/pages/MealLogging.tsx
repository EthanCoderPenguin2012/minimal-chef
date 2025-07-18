import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { Add } from '@mui/icons-material';

const MealLogging = () => {
  interface Meal {
    id: number;
    date: string;
    meal: string;
    recipe: string;
    calories: number;
  }

  interface NewMealForm {
    meal: string;
    recipe: string;
    calories: string;
    date: string;
  }

  const [meals, setMeals] = useState<Meal[]>([
    {
      id: 1,
      date: '2024-01-15',
      meal: 'Breakfast',
      recipe: 'Avocado Toast',
      calories: 320,
    },
    {
      id: 2,
      date: '2024-01-15',
      meal: 'Lunch',
      recipe: 'Caesar Salad',
      calories: 450,
    },
    {
      id: 3,
      date: '2024-01-15',
      meal: 'Dinner',
      recipe: 'Grilled Salmon',
      calories: 580,
    },
  ]);
  const [open, setOpen] = useState(false);
  const todayDate: string = new Date().toISOString().split('T')[0] as string;
  const [newMeal, setNewMeal] = useState<NewMealForm>({
    meal: '',
    recipe: '',
    calories: '',
    date: todayDate,
  });

  const addMeal = () => {
    if (newMeal.meal && newMeal.recipe) {
      const mealToAdd: Meal = {
        id: Date.now(),
        date: newMeal.date,
        meal: newMeal.meal,
        recipe: newMeal.recipe,
        calories: parseInt(newMeal.calories) || 0,
      };
      setMeals([...meals, mealToAdd]);
      setNewMeal({ meal: '', recipe: '', calories: '', date: todayDate });
      setOpen(false);
    }
  };

  const todaysMeals = meals.filter(
    (meal) => meal.date === new Date().toISOString().split('T')[0]
  );
  const totalCalories = todaysMeals.reduce(
    (sum, meal) => sum + meal.calories,
    0
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Meal Logging
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Today's Calories</Typography>
              <Typography variant="h4" color="primary">
                {totalCalories}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Meals Logged</Typography>
              <Typography variant="h4" color="primary">
                {todaysMeals.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Avg per Meal</Typography>
              <Typography variant="h4" color="primary">
                {todaysMeals.length
                  ? Math.round(totalCalories / todaysMeals.length)
                  : 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h5">Today's Meals</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Log Meal
        </Button>
      </Box>

      <List>
        {todaysMeals.map((meal) => (
          <Card key={meal.id} sx={{ mb: 1 }}>
            <ListItem>
              <ListItemText
                primary={meal.recipe}
                secondary={
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={meal.meal} size="small" />
                    <Chip
                      label={`${meal.calories} cal`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                }
              />
            </ListItem>
          </Card>
        ))}
      </List>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Log New Meal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Meal Type"
            value={newMeal.meal}
            onChange={(e) => setNewMeal({ ...newMeal, meal: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
            placeholder="Breakfast, Lunch, Dinner, Snack"
          />
          <TextField
            fullWidth
            label="Recipe/Food"
            value={newMeal.recipe}
            onChange={(e) => setNewMeal({ ...newMeal, recipe: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Calories (optional)"
            type="number"
            value={newMeal.calories}
            onChange={(e) =>
              setNewMeal({ ...newMeal, calories: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={addMeal} variant="contained">
            Log Meal
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MealLogging;
