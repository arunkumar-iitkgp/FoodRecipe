import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite articles
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
  toggleFavorite: (state, action) => {
    const itemExists = state.favoriterecipes.find(item => item.idFood === action.payload.idFood);
    
    if (itemExists) {
      // Remove the item from favorites if it's already there
      state.favoriterecipes = state.favoriterecipes.filter(item => item.idFood !== action.payload.idFood);
    } else {
      // Add the item to favorites if it's not there
      state.favoriterecipes.push(action.payload);
    }
  }
},
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
