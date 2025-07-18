import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import { Add, Delete, PhotoCamera } from '@mui/icons-material';

interface NewRecipeState {
  title: string;
  description: string;
  cookTime: string;
  servings: string;
  image: string | null;
  tags: string[];
  ingredients: string[];
  instructions: string[];
}

const NewRecipe = () => {
  const [recipe, setRecipe] = useState<NewRecipeState>({
    title: '',
    description: '',
    cookTime: '',
    servings: '',
    image: null,
    tags: [],
    ingredients: [''],
    instructions: [''],
  });
  const [newTag, setNewTag] = useState('');

  const addIngredient = () => {
    setRecipe({ ...recipe, ingredients: [...recipe.ingredients, ''] });
  };

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const removeIngredient = (index: number) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe({ ...recipe, ingredients: newIngredients });
  };

  const addInstruction = () => {
    setRecipe({ ...recipe, instructions: [...recipe.instructions, ''] });
  };

  const updateInstruction = (index: number, value: string) => {
    const newInstructions = [...recipe.instructions];
    newInstructions[index] = value;
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const removeInstruction = (index: number) => {
    const newInstructions = recipe.instructions.filter((_, i) => i !== index);
    setRecipe({ ...recipe, instructions: newInstructions });
  };

  const addTag = () => {
    if (newTag.trim() && !recipe.tags.includes(newTag.trim())) {
      setRecipe({ ...recipe, tags: [...recipe.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setRecipe({
      ...recipe,
      tags: recipe.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setRecipe({ ...recipe, image: e.target.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const saveRecipe = () => {
    const newRecipe = {
      id: Date.now(),
      name: recipe.title,
      description: recipe.description,
      servings: parseInt(recipe.servings) || 4,
      cookTime: recipe.cookTime,
      ingredients: recipe.ingredients.filter((ing) => ing.trim()),
      instructions: recipe.instructions.filter((inst) => inst.trim()),
      tags: recipe.tags,
      image: recipe.image,
      source: 'custom',
      createdAt: new Date().toISOString(),
    };

    const existingRecipes = JSON.parse(
      localStorage.getItem('minimalChefCustomRecipes') || '[]'
    );
    existingRecipes.push(newRecipe);
    localStorage.setItem(
      'minimalChefCustomRecipes',
      JSON.stringify(existingRecipes)
    );

    alert('Recipe saved to Library!');
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Recipe
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <TextField
                fullWidth
                label="Recipe Title"
                value={recipe.title}
                onChange={(e) =>
                  setRecipe({ ...recipe, title: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={recipe.description}
                onChange={(e) =>
                  setRecipe({ ...recipe, description: e.target.value })
                }
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Cook Time"
                    placeholder="e.g., 30 min"
                    value={recipe.cookTime}
                    onChange={(e) =>
                      setRecipe({ ...recipe, cookTime: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Servings"
                    type="number"
                    value={recipe.servings}
                    onChange={(e) =>
                      setRecipe({ ...recipe, servings: e.target.value })
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ingredients
              </Typography>
              <List>
                {recipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index}>
                    <TextField
                      fullWidth
                      placeholder={`Ingredient ${index + 1}`}
                      value={ingredient}
                      onChange={(e) => updateIngredient(index, e.target.value)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeIngredient(index)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Button startIcon={<Add />} onClick={addIngredient}>
                Add Ingredient
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Instructions
              </Typography>
              <List>
                {recipe.instructions.map((instruction, index) => (
                  <ListItem key={index}>
                    <TextField
                      fullWidth
                      multiline
                      placeholder={`Step ${index + 1}`}
                      value={instruction}
                      onChange={(e) => updateInstruction(index, e.target.value)}
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => removeInstruction(index)}>
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
              <Button startIcon={<Add />} onClick={addInstruction}>
                Add Step
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recipe Image
              </Typography>
              {recipe.image ? (
                <Box sx={{ mb: 2 }}>
                  <img
                    src={recipe.image}
                    alt="Recipe"
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    height: 200,
                    border: '2px dashed',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2,
                  }}
                >
                  <Typography color="text.secondary">
                    No image uploaded
                  </Typography>
                </Box>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<PhotoCamera />}
                  fullWidth
                >
                  Upload Image
                </Button>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ mb: 2 }}>
                {recipe.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => removeTag(tag)}
                    sx={{ mr: 0.5, mb: 0.5 }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  placeholder="Add tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag}>Add</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={saveRecipe} size="large">
          Save Recipe
        </Button>
        <Button variant="outlined" size="large">
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default NewRecipe;
