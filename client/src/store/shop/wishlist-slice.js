import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("wishlist")) || [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlistItem: (state, action) => {
      const product = action.payload;
      const existingIndex = state.items.findIndex(
        (item) => item._id === product._id
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }
      
      localStorage.setItem("wishlist", JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlistItem } = wishlistSlice.actions;

export default wishlistSlice.reducer;
