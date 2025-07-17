import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Slider,
} from '@mui/material';
import { Link, ShoppingCart } from '@mui/icons-material';
import { importRecipeFromUrl, adjustServings } from '../utils/recipeImporter';

interface ImportedRecipe {
  title: string;
  originalServings: number;
  ingredients: string[];
  instructions: string[];
  cookTime?: string;
  prepTime?: string;
  image?: string;
}

const RecipeImport = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<ImportedRecipe | null>(null);
  const [servings, setServings] = useState(4);
  const [selectedIngredients, setSelectedIngredients] = useState<boolean[]>([]);

  const importRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/import-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) {
        throw new Error('Failed to import recipe');
      }
      
      const data = await response.json();
      
      // Debug logging if available
      if ((window as any).debug && localStorage.getItem('debugMode') === 'true') {
        console.log('Recipe import data:', data);
      }
      
      const importedRecipe = {
        title: data.recipe.name || 'Imported Recipe',
        originalServings: data.recipe.servings || 4,
        ingredients: data.recipe.ingredients || [],
        instructions: data.recipe.instructions || [],
        cookTime: data.recipe.cookTime,
        prepTime: data.recipe.prepTime,
        image: data.recipe.image
      };
      
      setRecipe(importedRecipe);
      setSelectedIngredients(new Array(importedRecipe.ingredients.length).fill(false));
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import recipe. Please check the URL and try again.');
    }
    setLoading(false);
  };

  const adjustedIngredients = recipe ? recipe.ingredients.map(ingredient => {
    return ingredient.replace(/\d+(\.\d+)?/g, (match) => {
      const num = parseFloat(match);
      const ratio = servings / recipe.originalServings;
      const adjusted = (num * ratio).toFixed(2).replace(/\.?0+$/, '');
      return adjusted;
    });
  }) : [];

  const addToShoppingList = () => {
    const selected = adjustedIngredients?.filter((_: string, index: number) => selectedIngredients[index]);
    const existingList = JSON.parse(localStorage.getItem('minimalChefShoppingList') || '[]');
    const newItems = selected.map(item => ({ id: Date.now() + Math.random(), text: item, completed: false }));
    localStorage.setItem('minimalChefShoppingList', JSON.stringify([...existingList, ...newItems]));
    alert(`Added ${selected.length} ingredients to shopping list!`);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Import Recipe
      </Typography>
      
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Paste recipe URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={importRecipe}
            disabled={!url.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <Link />}
          >
            {loading ? 'Importing...' : 'Import Recipe'}
          </Button>
        </CardContent>
      </Card>

      {!recipe && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Universal Recipe Import
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Works with virtually ALL recipe and cooking websites using multiple extraction methods:
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ✅ JSON-LD structured data • ✅ Microdata parsing • ✅ Intelligent HTML scraping
            </Typography>
          </CardContent>
        </Card>
      )}

      {recipe && (
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {recipe.title}
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom>
                Adjust Servings: {servings} (Original: {recipe.originalServings})
              </Typography>
              <Slider
                value={servings}
                onChange={(e, value) => {
                  if (typeof value === 'number') setServings(value);
                }}
                min={1}
                max={20}
                marks
                valueLabelDisplay="auto"
              />
            </Box>
            
            <Typography variant="h6" gutterBottom>
              Ingredients
            </Typography>
            <List>
              {adjustedIngredients.map((ingredient: string, index: number) => (
                <ListItem key={index}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedIngredients[index]}
                        onChange={() => {
                          const updated = [...selectedIngredients];
                          updated[index] = !updated[index];
                          setSelectedIngredients(updated);
                        }}
                      />
                    }
                    label={ingredient}
                  />
                </ListItem>
              ))}
            </List>
            
            <Button
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={addToShoppingList}
              disabled={!selectedIngredients.some(Boolean)}
            >
              Add Selected to Shopping List
            </Button>
            
            <Typography variant="h6" sx={{ mt: 3 }}>
              Instructions
            </Typography>
            <List>
              {recipe.instructions.map((step: string, index: number) => (
                <ListItem key={index}>
                  <ListItemText primary={`Step ${index + 1}: ${step}`} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default RecipeImport;