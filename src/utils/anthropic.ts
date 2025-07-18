import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY || '',
});

export const generateRecipe = async (prompt: string) => {
  try {
    const response = await anthropic.completions.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens_to_sample: 1000,
      prompt: `Create a detailed recipe based on this request: "${prompt}". \nReturn a JSON object with: title, cookTime, servings, ingredients (array), instructions (array), tags (array).\nMake it practical and delicious.`,
    });

    return JSON.parse(response.completion);
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
};
