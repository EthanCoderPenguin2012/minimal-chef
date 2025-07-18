// Recipe URL import utility
export const importRecipeFromUrl = async (url: string) => {
  try {
    // Simulate recipe extraction from URL
    console.log(`Importing recipe from URL: ${url}`);
    const mockRecipe = {
      title: 'Imported Recipe',
      originalServings: 4,
      ingredients: [
        '2 cups flour',
        '1 cup sugar',
        '1/2 cup butter',
        '2 eggs',
        '1 tsp vanilla',
      ],
      instructions: [
        'Preheat oven to 350°F',
        'Mix dry ingredients',
        'Cream butter and sugar',
        'Add eggs and vanilla',
        'Combine wet and dry ingredients',
        'Bake for 25-30 minutes',
      ],
      cookTime: '30 min',
      prepTime: '15 min',
      image:
        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
    };

    return mockRecipe;
  } catch (error) {
    throw new Error('Failed to import recipe from URL');
  }
};

export const adjustServings = (
  ingredients: string[],
  originalServings: number,
  newServings: number
) => {
  const ratio = newServings / originalServings;

  return ingredients.map((ingredient: string) => {
    return ingredient.replace(/(\d+(?:\.\d+)?)/g, (match: string) => {
      const num = parseFloat(match);
      const adjusted = (num * ratio).toFixed(2).replace(/\.?0+$/, '');
      return adjusted;
    });
  });
};
