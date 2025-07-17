// Mock fetch API
global.fetch = jest.fn();

// Add TextEncoder and TextDecoder to global
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Mock URL
global.URL = class URL {
  constructor(url, base) {
    this.url = url;
    this.base = base;
    this.origin = 'https://example.com';
  }
};

// Mock web streams API
class MockReadableStream {
  constructor() {}
  getReader() { return { read: () => Promise.resolve({ done: true }) }; }
}

global.ReadableStream = MockReadableStream;
global.WritableStream = class {};
global.TransformStream = class {};

// Mock FormData
global.FormData = class FormData {
  constructor() {
    this.data = {};
  }
  append(key, value) {
    this.data[key] = value;
  }
};