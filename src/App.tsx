import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { AuthProvider } from './contexts/AuthContext';
import { DebugProvider, useDebug } from './contexts/DebugContext';
import { LanguageProvider } from './contexts/LanguageContext';
import DebugPanel from './components/DebugPanel';
import RTLThemeProvider from './components/RTLThemeProvider';

import { getThemeWithRTLSupport } from './theme';
import { useTheme } from './hooks/useTheme';
import { useLanguage } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Recipes from './pages/Recipes';
import Discover from './pages/Discover';
import ShoppingList from './pages/ShoppingList';
import Settings from './pages/Settings';
import AIRecipe from './pages/AIRecipe';
import MealLogging from './pages/MealLogging';
import RecipeImport from './pages/RecipeImport';
import VoiceChef from './pages/VoiceChef';
import NewRecipe from './pages/NewRecipe';
import RecipeDetail from './pages/RecipeDetail';
import AddShoppingItem from './pages/AddShoppingItem';
import InstacartIntegration from './pages/InstacartIntegration';
import RecipeTimer from './pages/RecipeTimer';
import NutritionTracker from './pages/NutritionTracker';
import RecipeRoulette from './pages/RecipeRoulette';
import Login from './pages/Login';
import Library from './pages/Library';

const AppContent: React.FC = () => {
  // isDarkMode is used in the parent component
  const { isDarkMode: _ } = useTheme();
  const { isDebugMode } = useDebug();

  return (
    <>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Recipes />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/shopping" element={<ShoppingList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai-recipe" element={<AIRecipe />} />
            <Route path="/meals" element={<MealLogging />} />
            <Route path="/import" element={<RecipeImport />} />
            <Route path="/voice-chef" element={<VoiceChef />} />
            <Route path="/recipe/new" element={<NewRecipe />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/shopping/add" element={<AddShoppingItem />} />
            <Route path="/instacart" element={<InstacartIntegration />} />
            <Route path="/timer" element={<RecipeTimer />} />
            <Route path="/nutrition" element={<NutritionTracker />} />
            <Route path="/roulette" element={<RecipeRoulette />} />
            <Route path="/login" element={<Login />} />
            <Route path="/library" element={<Library />} />
          </Routes>
        </Layout>
      </Router>
      {isDebugMode && <DebugPanel />}
      <Analytics />
      <SpeedInsights />
    </>
  );
};

const App: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <DebugProvider>
      <LanguageProvider>
        <RTLThemeProvider isDarkMode={isDarkMode}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </RTLThemeProvider>
      </LanguageProvider>
    </DebugProvider>
  );
};

export default App;
