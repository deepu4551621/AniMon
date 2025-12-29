import { configureStore } from '@reduxjs/toolkit';
import animeReducer from './slices/animeSlice';
import watchlistReducer from './slices/watchlistSlice';
import discoveryReducer from './slices/discoverySlice';
export const store = configureStore({
  reducer: {
    anime: animeReducer,
    watchlist: watchlistReducer,
    discovery: discoveryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
