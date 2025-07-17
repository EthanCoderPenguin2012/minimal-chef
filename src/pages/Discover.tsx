import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllRecipes, internationalRecipes } from '../utils/recipeDatabase';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Chip,
} from '@mui/material';

const cuisineTypes = ['All', 'Italian', 'Indian', 'Japanese', 'Mexican', 'French', 'Thai', 'Chinese', 'Korean', 'Greek', 'Moroccan', 'Spanish', 'Turkish', 'Brazilian', 'Vietnamese', 'Peruvian', 'Lebanese', 'British', 'American', 'German', 'Russian', 'Ethiopian', 'Nigerian', 'Jamaican', 'Argentinian', 'Australian', 'Canadian'];

const discoverRecipes = getAllRecipes().map(recipe => {
  let cuisine = '';
  
  // Find the cuisine for this recipe
  for (const country of Object.keys(internationalRecipes)) {
    const recipes = internationalRecipes[country as keyof typeof internationalRecipes];
    if (recipes && recipes.some(r => r.id === recipe.id)) {
      cuisine = country.charAt(0).toUpperCase() + country.slice(1);
      break;
    }
  }
  
  return {
    id: recipe.id,
    title: recipe.name,
    image: recipe.image,
    cuisine,
    difficulty: recipe.difficulty,
    rating: (4.2 + Math.random() * 0.7).toFixed(1),
    cookTime: recipe.cookTime,
    region: recipe.region
  };
});

const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCuisine, setSelectedCuisine] = useState(0);

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Discover Recipes
      </Typography>
      
      <Tabs
        value={selectedCuisine}
        onChange={(_, newValue) => setSelectedCuisine(newValue as number)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
      >
        {cuisineTypes.map((cuisine) => (
          <Tab key={cuisine} label={cuisine} />
        ))}
      </Tabs>

      <Grid container spacing={3}>
        {discoverRecipes
          .filter(recipe => {
            if (selectedCuisine === 0) return true;
            const selectedCuisineType = cuisineTypes[selectedCuisine];
            return selectedCuisineType && recipe.cuisine?.toLowerCase() === selectedCuisineType.toLowerCase();
          })
          .map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card 
              sx={{ height: '100%', cursor: 'pointer' }}
              onClick={() => navigate(`/recipe/${recipe.id}`)}
            >
              <CardMedia
                component="img"
                height="200"
                image={recipe.image}
                alt={recipe.title}
              />
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {recipe.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <Chip label={recipe.cuisine} size="small" />
                  <Chip label={recipe.difficulty} size="small" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  ⭐ {recipe.rating} • {recipe.cookTime}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Discover;