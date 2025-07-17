import { lightTheme, darkTheme } from '../theme';

describe('Theme Configuration', () => {
  test('lightTheme has correct properties', () => {
    expect(lightTheme.palette.mode).toBe('light');
    expect(lightTheme.palette.primary.main).toBe('#203141');
    expect(lightTheme.palette.background.default).toBe('#EADDCB');
    expect(lightTheme.palette.background.paper).toBe('#F5F0E8');
    expect(lightTheme.palette.text.primary).toBe('#203141');
  });

  test('darkTheme has correct properties', () => {
    expect(darkTheme.palette.mode).toBe('dark');
    expect(darkTheme.palette.primary.main).toBe('#EADDCB');
    expect(darkTheme.palette.background.default).toBe('#203141');
    expect(darkTheme.palette.background.paper).toBe('#2A3F52');
    expect(darkTheme.palette.text.primary).toBe('#EADDCB');
  });

  test('typography is consistent between themes', () => {
    expect(JSON.stringify(darkTheme.typography)).toBe(JSON.stringify(lightTheme.typography));
  });

  test('typography has correct font families', () => {
    const serifFonts = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2'
    ];
    
    const sansSerifFonts = [
      'body1', 'body2', 'button', 'caption', 'overline'
    ];

    serifFonts.forEach(key => {
      expect(lightTheme.typography[key].fontFamily).toBe('"Times New Roman", serif');
    });

    sansSerifFonts.forEach(key => {
      expect(lightTheme.typography[key].fontFamily).toBe('"Noto Sans", sans-serif');
    });
  });
});