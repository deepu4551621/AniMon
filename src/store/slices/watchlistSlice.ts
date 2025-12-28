import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type WatchlistState = {
  items: any[];
};

const initialState: WatchlistState = {
  items: [],
};

const slice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<any>) {
      const it = action.payload;
      if (!state.items.find((x) => x.mal_id === it.mal_id)) state.items.unshift(it);
    },
    removeItem(state, action: PayloadAction<number | string>) {
      const id = action.payload;
      state.items = state.items.filter((x) => x.mal_id !== id);
    },
    toggleItem(state, action: PayloadAction<any>) {
      const it = action.payload;
      const exists = state.items.find((x) => x.mal_id === it.mal_id);
      if (exists) state.items = state.items.filter((x) => x.mal_id !== it.mal_id);
      else state.items.unshift(it);
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, toggleItem, clear } = slice.actions;
export default slice.reducer;
