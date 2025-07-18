import recipeData from '../data/recipes.json';
import { RecipeDatabase, Recipe } from '../types/recipe';

export const internationalRecipes = recipeData as RecipeDatabase;

export const getRecipesByCountry = (country: string): Recipe[] => {
  return internationalRecipes[country.toLowerCase()] || [];
};

export const getAllRecipes = (): Recipe[] => {
  return Object.values(internationalRecipes).flat();
};

export const getCountries = () => {
  return Object.keys(internationalRecipes).map((key) => ({
    key,
    name: key.charAt(0).toUpperCase() + key.slice(1),
    count: internationalRecipes[key]?.length || 0,
  }));
};

export const searchRecipes = (query: string): Recipe[] => {
  const allRecipes = getAllRecipes();
  return allRecipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.region.toLowerCase().includes(query.toLowerCase()) ||
      recipe.difficulty.toLowerCase().includes(query.toLowerCase())
  );
};
