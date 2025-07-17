describe('Test Setup', () => {
  test('localStorage mock is working', () => {
    localStorage.setItem('test', 'value');
    expect(localStorage.setItem).toHaveBeenCalledWith('test', 'value');
    
    localStorage.getItem('test');
    expect(localStorage.getItem).toHaveBeenCalledWith('test');
    
    localStorage.removeItem('test');
    expect(localStorage.removeItem).toHaveBeenCalledWith('test');
    
    localStorage.clear();
    expect(localStorage.clear).toHaveBeenCalled();
  });

  test('fetch mock is working', () => {
    fetch('https://example.com');
    expect(fetch).toHaveBeenCalledWith('https://example.com');
  });

  test('window.confirm mock is working', () => {
    window.confirm('Are you sure?');
    expect(window.confirm).toHaveBeenCalledWith('Are you sure?');
  });
});