import { createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
  name: 'app',
  initialState: {
    theme: 'dark',
    isLoading: false
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    }
  }
});

export const { toggleTheme, setLoading } = appSlice.actions;
export default appSlice.reducer;