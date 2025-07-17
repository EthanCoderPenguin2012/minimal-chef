import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { AutoAwesome, Restaurant } from '@mui/icons-material';
import { generateRecipe } from '../utils/anthropic';

interface GeneratedRecipe {
  title: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  tags: string[];
}

const AIRecipe: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<GeneratedRecipe | null>(null);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    try {
      const generatedRecipe = await generateRecipe(prompt);
      setRecipe(generatedRecipe);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      // Fallback to mock data
      setRecipe({
        title: 'AI-Generated Mediterranean Bowl',
        cookTime: '25 min',
        servings: 2,
        ingredients: [
          '1 cup quinoa',
          '2 tbsp olive oil',
          '1 cucumber, diced',
          '1 cup cherry tomatoes',
          '1/2 red onion',
          '1/4 cup feta cheese',
          '2 tbsp lemon juice'
        ],
        instructions: [
          'Cook quinoa according to package directions',
          'Dice vegetables while quinoa cooks',
          'Mix olive oil and lemon juice for dressing',
          'Combine all ingredients in a bowl',
          'Top with feta cheese and serve'
        ],
        tags: ['Healthy', 'Mediterranean', 'AI-Generated']
      });
    }
    setLoading(false);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        AI Recipe Generator
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Describe what you want to cook... (e.g., 'healthy dinner with chicken and vegetables')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={handleGenerateRecipe}
            disabled={!prompt.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesome />}
          >
            {loading ? 'Generating...' : 'Generate Recipe'}
          </Button>
        </CardContent>
      </Card>

      {recipe && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {recipe.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {recipe.cookTime} • {recipe.servings} servings
            </Typography>
            <Box sx={{ mb: 2 }}>
              {recipe.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" sx={{ mr: 0.5 }} />
              ))}
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Ingredients
            </Typography>
            <List dense>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index}>
                  <ListItemText primary={ingredient} />
                </ListItem>
              ))}
            </List>
            
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            <List>
              {recipe.instructions.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText 
                    primary={`${index + 1}. ${step}`}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button
              variant="outlined"
              startIcon={<Restaurant />}
              sx={{ mt: 2 }}
            >
              Save Recipe
            </Button>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default AIRecipe;