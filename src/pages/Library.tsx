import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  IconButton,
  Tabs,
  Tab,
  InputAdornment,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Search,
  Favorite,
  FavoriteBorder,
  Sort,
  ImportExport,
  Restaurant,
  Clear,
} from '@mui/icons-material';

interface Recipe {
  id: number;
  name: string;
  description?: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  prepTime?: string;
  cookTime?: string;
  tags?: string[];
  source: 'imported' | 'custom' | 'database';
  favorite?: boolean;
  createdAt: string;
}

const Library = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [sortAnchor, setSortAnchor] = useState<null | HTMLElement>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'favorites'>('date');

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterAndSortRecipes();
  }, [recipes, searchQuery, activeTab, sortBy]);

  const loadRecipes = () => {
    const importedRecipes = JSON.parse(localStorage.getItem('minimalChefRecipes') || '[]');
    const customRecipes = JSON.parse(localStorage.getItem('minimalChefCustomRecipes') || '[]');
    const favorites = JSON.parse(localStorage.getItem('minimalChefFavorites') || '[]');

    const allRecipes = [
      ...importedRecipes.map((r: any) => ({ ...r, source: 'imported' as const })),
      ...customRecipes.map((r: any) => ({ ...r, source: 'custom' as const }))
    ].map(recipe => ({
      ...recipe,
      favorite: favorites.includes(recipe.id)
    }));

    setRecipes(allRecipes);
  };

  const filterAndSortRecipes = () => {
    let filtered = recipes;

    // Filter by tab
    if (activeTab === 1) {
      filtered = filtered.filter(r => r.source === 'imported');
    } else if (activeTab === 2) {
      filtered = filtered.filter(r => r.source === 'custom');
    } else if (activeTab === 3) {
      filtered = filtered.filter(r => r.favorite);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.description?.toLowerCase().includes(query) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(query)) ||
        recipe.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'favorites':
          return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredRecipes(filtered);
  };

  const toggleFavorite = (recipeId: number) => {
    const favorites = JSON.parse(localStorage.getItem('minimalChefFavorites') || '[]');
    const updatedFavorites = favorites.includes(recipeId)
      ? favorites.filter((id: number) => id !== recipeId)
      : [...favorites, recipeId];
    
    localStorage.setItem('minimalChefFavorites', JSON.stringify(updatedFavorites));
    loadRecipes();
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'imported': return <ImportExport />;
      case 'custom': return <Restaurant />;
      default: return <Restaurant />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'imported': return 'primary';
      case 'custom': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Recipe Library
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search recipes, ingredients, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton onClick={() => setSearchQuery('')} size="small">
                  <Clear />
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
            <Tab label={`All (${recipes.length})`} />
            <Tab label={`Imported (${recipes.filter(r => r.source === 'imported').length})`} />
            <Tab label={`Custom (${recipes.filter(r => r.source === 'custom').length})`} />
            <Tab label={`Favorites (${recipes.filter(r => r.favorite).length})`} />
          </Tabs>

          <Box>
            <Button
              startIcon={<Sort />}
              onClick={(e) => setSortAnchor(e.currentTarget)}
              size="small"
            >
              Sort
            </Button>
            <Menu
              anchorEl={sortAnchor}
              open={Boolean(sortAnchor)}
              onClose={() => setSortAnchor(null)}
            >
              <MenuItem onClick={() => { setSortBy('date'); setSortAnchor(null); }}>
                Date Added
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('name'); setSortAnchor(null); }}>
                Name A-Z
              </MenuItem>
              <MenuItem onClick={() => { setSortBy('favorites'); setSortAnchor(null); }}>
                Favorites First
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Showing {filteredRecipes.length} recipes
      </Typography>

      <Grid container spacing={2}>
        {filteredRecipes.map((recipe) => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {recipe.image && (
                <CardMedia
                  component="img"
                  height="140"
                  image={recipe.image}
                  alt={recipe.name}
                />
              )}
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ flexGrow: 1 }}>
                    {recipe.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => toggleFavorite(recipe.id)}
                    color={recipe.favorite ? 'error' : 'default'}
                  >
                    {recipe.favorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                </Box>

                {recipe.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {recipe.description.substring(0, 100)}...
                  </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={getSourceIcon(recipe.source)}
                    label={recipe.source}
                    size="small"
                    color={getSourceColor(recipe.source) as any}
                    variant="outlined"
                  />
                  {recipe.servings && (
                    <Chip label={`${recipe.servings} servings`} size="small" />
                  )}
                  {recipe.prepTime && (
                    <Chip label={recipe.prepTime} size="small" />
                  )}
                </Box>

                <Typography variant="body2" color="text.secondary">
                  {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredRecipes.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No recipes found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {searchQuery ? 'Try adjusting your search terms' : 'Start by importing or creating some recipes!'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Library;