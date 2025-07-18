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
import { useTranslation } from 'react-i18next';

const Recipes: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useTranslation(['recipes', 'common']);

  // Get recipes with translated difficulty levels
  const recipes = getAllRecipes().map((recipe) => ({
    id: recipe.id,
    title: recipe.name,
    image: recipe.image,
    cookTime: recipe.cookTime,
    servings: 4,
    tags: [
      recipe.region,
      t(`difficulty.${recipe.difficulty.toLowerCase()}`, recipe.difficulty),
    ],
    country: Object.keys(internationalRecipes).find((country) =>
      internationalRecipes[country as keyof typeof internationalRecipes]?.some(
        (r) => r.id === recipe.id
      )
    ),
  }));

  const [allRecipes] = useState(recipes);

  const filteredRecipes = allRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('title', 'Recipes')}
      </Typography>

      <TextField
        fullWidth
        placeholder={t('searchRecipes', 'Search recipes...')}
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
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {t('cookTime', 'Cook Time')}: {recipe.cookTime} •{' '}
                    {recipe.servings} {t('servings', 'servings')}
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
          ))
        ) : (
          <Grid item xs={12}>
            <Typography align="center" color="textSecondary">
              {t('noRecipes', 'No recipes found')}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Recipes;
