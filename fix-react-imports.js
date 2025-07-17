// This file is for development purposes only and will not be included in the main branch following an update.
const fs = require('fs');
const path = require('path');

// List of files to fix
const filesToFix = [
  'src/components/Layout.tsx',
  'src/pages/AddShoppingItem.tsx',
  'src/pages/Discover.tsx',
  'src/pages/InstacartIntegration.tsx',
  'src/components/DebugPanel.tsx',
  'src/pages/AIRecipe.tsx',
  'src/pages/RecipeDetail.tsx',
  'src/pages/Recipes.tsx',
  'src/pages/RecipeRoulette.tsx',
  'src/pages/RecipeImport.tsx',
  'src/pages/Login.tsx',
  'src/pages/ShoppingList.tsx',
  'src/pages/NutritionTracker.tsx',
  'src/pages/NewRecipe.tsx',
  'src/pages/MealLogging.tsx'
];

// Process each file
filesToFix.forEach(filePath => {
  try {
    const fullPath = path.resolve(filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace the import statement
    const updatedContent = content.replace(
      'import React, { useState } from \'react\';',
      'import { useState } from \'react\';'
    );
    
    // Write the updated content back to the file
    fs.writeFileSync(fullPath, updatedContent, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
});

console.log('All files processed.');