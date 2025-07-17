import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getAllRecipes, internationalRecipes } from '../utils/recipeDatabase';
import { useNavigate } from 'react-router-dom';

const recipes = getAllRecipes().map(recipe => ({
  id: recipe.id,
  title: recipe.name,
  image: recipe.image,
  cookTime: recipe.cookTime,
  servings: 4,
  tags: [recipe.region, recipe.difficulty],
  country: Object.keys(internationalRecipes).find(country => 
    internationalRecipes[country].some(r => r.id === recipe.id)
  )
}));

const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [allRecipes] = useState(recipes);

  const filteredRecipes = allRecipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        My Recipes
      </Typography>
      
      <TextField
        fullWidth
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredRecipes.map((recipe) => (
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
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {recipe.cookTime} • {recipe.servings} servings
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {recipe.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Recipes;