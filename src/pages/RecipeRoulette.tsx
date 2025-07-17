import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert,
  CardMedia,
} from '@mui/material';
import { Casino, Refresh, Restaurant, AccessTime } from '@mui/icons-material';

const RecipeRoulette = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [filters, setFilters] = useState<string[]>([]);

  const recipes = [
    {
      id: 1,
      name: 'Spaghetti Carbonara',
      cuisine: 'Italian',
      difficulty: 'Medium',
      time: '20 min',
      image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300',
      tags: ['pasta', 'quick', 'comfort']
    },
    {
      id: 2,
      name: 'Chicken Tikka Masala',
      cuisine: 'Indian',
      difficulty: 'Hard',
      time: '45 min',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=300',
      tags: ['spicy', 'curry', 'protein']
    },
    {
      id: 3,
      name: 'Caesar Salad',
      cuisine: 'American',
      difficulty: 'Easy',
      time: '10 min',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=300',
      tags: ['healthy', 'quick', 'vegetarian']
    },
    {
      id: 4,
      name: 'Beef Tacos',
      cuisine: 'Mexican',
      difficulty: 'Easy',
      time: '25 min',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300',
      tags: ['spicy', 'quick', 'protein']
    },
    {
      id: 5,
      name: 'Pad Thai',
      cuisine: 'Thai',
      difficulty: 'Medium',
      time: '30 min',
      image: 'https://images.unsplash.com/photo-1559314809-0f31657def5e?w=300',
      tags: ['noodles', 'spicy', 'asian']
    }
  ];

  const availableFilters = ['quick', 'healthy', 'spicy', 'vegetarian', 'protein', 'comfort'];

  const spinRoulette = () => {
    setIsSpinning(true);
    setSelectedRecipe(null);

    setTimeout(() => {
      let filteredRecipes = recipes;
      
      if (filters.length > 0) {
        filteredRecipes = recipes.filter(recipe => 
          recipe.tags.some(tag => filters.includes(tag))
        );
      }

      if (filteredRecipes.length === 0) {
        filteredRecipes = recipes;
      }

      const randomIndex = Math.floor(Math.random() * filteredRecipes.length);
      setSelectedRecipe(filteredRecipes[randomIndex]);
      setIsSpinning(false);
    }, 2000);
  };

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'success';
      case 'Medium': return 'warning';
      case 'Hard': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipe Roulette
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Casino sx={{ mr: 1 }} />
        Can't decide what to cook? Let the roulette choose for you!
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Filters</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {availableFilters.map(filter => (
              <Chip
                key={filter}
                label={filter}
                onClick={() => toggleFilter(filter)}
                color={filters.includes(filter) ? 'primary' : 'default'}
                variant={filters.includes(filter) ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
          </Stack>
          
          <Button
            variant="contained"
            size="large"
            onClick={spinRoulette}
            disabled={isSpinning}
            startIcon={isSpinning ? <CircularProgress size={20} /> : <Casino />}
            fullWidth
          >
            {isSpinning ? 'Spinning...' : 'Spin the Roulette!'}
          </Button>
        </CardContent>
      </Card>

      {selectedRecipe && !isSpinning && (
        <Card>
          <CardMedia
            component="img"
            height="200"
            image={selectedRecipe.image}
            alt={selectedRecipe.name}
          />
          <CardContent>
            <Typography variant="h5" gutterBottom>
              🎉 Your Recipe: {selectedRecipe.name}
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <Chip 
                label={selectedRecipe.cuisine} 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={selectedRecipe.difficulty} 
                color={getDifficultyColor(selectedRecipe.difficulty)}
                variant="outlined"
              />
              <Chip 
                label={selectedRecipe.time} 
                icon={<AccessTime />}
                variant="outlined"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Tags: {selectedRecipe.tags.join(', ')}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Button variant="contained" startIcon={<Restaurant />}>
                View Recipe
              </Button>
              <Button variant="outlined" startIcon={<Refresh />} onClick={spinRoulette}>
                Spin Again
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}

      {!selectedRecipe && !isSpinning && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Casino sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Ready to discover your next meal?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click the spin button to get a random recipe suggestion!
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RecipeRoulette;