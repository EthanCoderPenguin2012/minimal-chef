// Mock cheerio
jest.mock('cheerio', () => {
  return {
    load: jest.fn((html) => {
      // Create a basic mock cheerio instance
      const mockCheerio = {
        find: jest.fn(() => mockCheerio),
        first: jest.fn(() => mockCheerio),
        text: jest.fn(() => ''),
        attr: jest.fn(() => ''),
        each: jest.fn((callback) => {}),
        map: jest.fn(() => ({ get: () => [] })),
        html: jest.fn(() => ''),
        length: 0
      };
      
      // Return a function that acts like the cheerio selector
      const $ = jest.fn((selector) => mockCheerio);
      
      // Add properties to the function to mimic cheerio's API
      $.html = jest.fn(() => html);
      
      return $;
    })
  };
});

// Mock fetch
global.fetch = jest.fn();

// Import the handler
const handler = require('../import-recipe').default;

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Import Recipe API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 405 for non-POST requests', async () => {
    const req = { method: 'GET' };
    const res = mockResponse();
    
    await handler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  test('returns 400 when URL is missing', async () => {
    const req = { method: 'POST', body: {} };
    const res = mockResponse();
    
    await handler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'URL is required' });
  });

  test('handles fetch errors gracefully', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    const req = { method: 'POST', body: { url: 'https://example.com/recipe' } };
    const res = mockResponse();
    
    await handler(req, res);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to import recipe' });
  });
});