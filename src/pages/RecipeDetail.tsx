import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Rating,
  Divider,
  Grid,
} from '@mui/material';
import {
  PlayArrow,
  ShoppingCart,
  Share,
  Favorite,
  FavoriteBorder,
  Timer,
  People,
  VolumeUp,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

import { getRecipeDetails } from '../utils/recipeDetailService';

const RecipeDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isFavorite, setIsFavorite] = useState(false);
  const [rating, setRating] = useState(4.5);

  const recipe = getRecipeDetails(parseInt(id || '0')) || {
    id: parseInt(id || '0'),
    name: 'Recipe Not Found',
    title: 'Recipe Not Found',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
    description: 'This recipe could not be found.',
    cookTime: '30 min',
    prepTime: '15 min',
    servings: 4,
    difficulty: 'Medium',
    calories: 400,
    tags: ['Unknown'],
    ingredients: ['Recipe not found'],
    instructions: ['Recipe not found'],
    nutrition: { calories: 400, protein: '20g', carbs: '45g', fat: '15g', fiber: '4g' }
  };

  const speakInstructions = () => {
    if ('speechSynthesis' in window) {
      const text = recipe.instructions.join('. Next step: ');
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const addToShoppingList = () => {
    console.log('Adding ingredients to shopping list:', recipe.ingredients);
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardMedia
          component="img"
          height="400"
          image={recipe.image}
          alt={recipe.title}
        />
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" component="h1">
              {recipe.title}
            </Typography>
            <IconButton onClick={() => setIsFavorite(!isFavorite)}>
              {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {recipe.description}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            {recipe.tags.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Box>

          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Timer />
                <Typography variant="body2">{recipe.cookTime}</Typography>
                <Typography variant="caption">Cook Time</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <People />
                <Typography variant="body2">{recipe.servings}</Typography>
                <Typography variant="caption">Servings</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2">{recipe.calories}</Typography>
                <Typography variant="caption">Calories</Typography>
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box sx={{ textAlign: 'center' }}>
                <Rating value={rating} readOnly size="small" />
                <Typography variant="caption">Rating</Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={() => navigate('/voice-chef')}
            >
              Start Cooking
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShoppingCart />}
              onClick={addToShoppingList}
            >
              Add to List
            </Button>
            <Button
              variant="outlined"
              startIcon={<VolumeUp />}
              onClick={speakInstructions}
            >
              Read Aloud
            </Button>
            <IconButton>
              <Share />
            </IconButton>
          </Box>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={ingredient} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((step, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={`Step ${index + 1}`}
                        secondary={step}
                      />
                    </ListItem>
                    {index < recipe.instructions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Nutrition Information
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(recipe.nutrition).map(([key, value]) => (
              <Grid item xs={6} sm={2.4} key={key}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h6">{value}</Typography>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                    {key}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default RecipeDetail;