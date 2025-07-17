import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { LocalFireDepartment, FitnessCenter, Restaurant } from '@mui/icons-material';

const NutritionTracker = () => {
  const [dailyGoals] = useState({
    calories: 2000,
    protein: 150,
    carbs: 250,
    fat: 65
  });

  const [consumed, setConsumed] = useState({
    calories: 1200,
    protein: 85,
    carbs: 140,
    fat: 35
  });

  const [meals, setMeals] = useState([
    { name: 'Breakfast: Oatmeal with berries', calories: 350, protein: 12, carbs: 65, fat: 8 },
    { name: 'Lunch: Grilled chicken salad', calories: 450, protein: 35, carbs: 25, fat: 18 },
    { name: 'Snack: Greek yogurt', calories: 150, protein: 15, carbs: 20, fat: 4 },
    { name: 'Dinner: Salmon with rice', calories: 550, protein: 40, carbs: 45, fat: 22 }
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });

  const getProgressColor = (current: number, goal: number) => {
    const percentage = (current / goal) * 100;
    if (percentage >= 100) return 'success';
    if (percentage >= 80) return 'warning';
    return 'primary';
  };

  const addMeal = () => {
    setMeals(prev => [...prev, newMeal]);
    setConsumed(prev => ({
      calories: prev.calories + newMeal.calories,
      protein: prev.protein + newMeal.protein,
      carbs: prev.carbs + newMeal.carbs,
      fat: prev.fat + newMeal.fat
    }));
    setNewMeal({ name: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
    setDialogOpen(false);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Nutrition Tracker
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalFireDepartment color="error" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Calories</Typography>
              <Typography variant="h4" color="primary">{consumed.calories}</Typography>
              <Typography variant="body2" color="text.secondary">/ {dailyGoals.calories}</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(consumed.calories / dailyGoals.calories) * 100}
                color={getProgressColor(consumed.calories, dailyGoals.calories)}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <FitnessCenter color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Protein</Typography>
              <Typography variant="h4" color="primary">{consumed.protein}g</Typography>
              <Typography variant="body2" color="text.secondary">/ {dailyGoals.protein}g</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(consumed.protein / dailyGoals.protein) * 100}
                color={getProgressColor(consumed.protein, dailyGoals.protein)}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Restaurant color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6">Carbs</Typography>
              <Typography variant="h4" color="primary">{consumed.carbs}g</Typography>
              <Typography variant="body2" color="text.secondary">/ {dailyGoals.carbs}g</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(consumed.carbs / dailyGoals.carbs) * 100}
                color={getProgressColor(consumed.carbs, dailyGoals.carbs)}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h6">Fat</Typography>
              <Typography variant="h4" color="primary">{consumed.fat}g</Typography>
              <Typography variant="body2" color="text.secondary">/ {dailyGoals.fat}g</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(consumed.fat / dailyGoals.fat) * 100}
                color={getProgressColor(consumed.fat, dailyGoals.fat)}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Today's Meals</Typography>
            <Button variant="contained" onClick={() => setDialogOpen(true)}>
              Add Meal
            </Button>
          </Box>
          
          <List>
            {meals.map((meal, index) => (
              <ListItem key={index} divider>
                <ListItemText 
                  primary={meal.name}
                  secondary={
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip size="small" label={`${meal.calories} cal`} />
                      <Chip size="small" label={`${meal.protein}g protein`} />
                      <Chip size="small" label={`${meal.carbs}g carbs`} />
                      <Chip size="small" label={`${meal.fat}g fat`} />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Meal</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Meal Name"
            value={newMeal.name}
            onChange={(e) => setNewMeal(prev => ({ ...prev, name: e.target.value }))}
            sx={{ mb: 2, mt: 1 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Calories"
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal(prev => ({ ...prev, calories: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Protein (g)"
                type="number"
                value={newMeal.protein}
                onChange={(e) => setNewMeal(prev => ({ ...prev, protein: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Carbs (g)"
                type="number"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal(prev => ({ ...prev, carbs: Number(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Fat (g)"
                type="number"
                value={newMeal.fat}
                onChange={(e) => setNewMeal(prev => ({ ...prev, fat: Number(e.target.value) }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={addMeal} variant="contained">Add Meal</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NutritionTracker;