// features/app/store/themeSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'dark'
};

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      
      // Update the HTML element theme
      document.documentElement.setAttribute('data-theme', state.theme);
      document.body.setAttribute('data-theme', state.theme);
      
      // Force a repaint
      const root = document.documentElement;
      root.style.display = 'none';
      root.offsetHeight; // Trigger a reflow
      root.style.display = '';

      console.log('Theme toggled:', {
        newTheme: state.theme,
        htmlTheme: document.documentElement.getAttribute('data-theme'),
        cssVars: {
          bg: getComputedStyle(document.documentElement).getPropertyValue('--color-bg-primary').trim(),
          text: getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim(),
        }
      });
    }
  }
});

export const { toggleTheme } = themeSlice.actions;
export const selectTheme = (state) => state.theme.theme;
export default themeSlice.reducer;