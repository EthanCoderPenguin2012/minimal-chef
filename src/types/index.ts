export interface Recipe {
  id: number;
  name: string;
  description?: string;
  image?: string;
  ingredients: string[];
  instructions: string[];
  servings: number;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  tags?: string[];
  source: 'imported' | 'custom' | 'database';
  favorite?: boolean;
  createdAt: string;
  importedFrom?: string;
}

export interface User {
  email: string;
  username: string;
  hash: string;
  verified?: boolean;
}

export interface ShoppingItem {
  id: number;
  text: string;
  completed: boolean;
  category?: string;
}

export interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Timer {
  id: number;
  name: string;
  duration: number;
  remaining: number;
  isActive: boolean;
}