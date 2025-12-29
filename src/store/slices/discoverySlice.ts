import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
const baseUrl = 'https://api.jikan.moe/v4';
type DiscoveryState = {
  query: string;
  filtersVisible: boolean;
  year: string;
  selectedGenres: string[]; // store genre ids
  studio: string;
  minRating: string;
  searchMode: 'basic' | 'advanced';
  page: number;
  searchResults: any[];
  genresMeta: any[];
  hasNext: boolean;
  loading: boolean;
  error?: string | null;
  genreType: 'genres' | 'explicit_genres' | 'themes' | 'demographics';
  genreQueryFilter: string;
};

const initialState: DiscoveryState = {
  query: '',
  filtersVisible: false,
  year: '',
  selectedGenres: [],
  studio: '',
  minRating: '0',
  searchMode: 'basic',
  page: 1,
  searchResults: [],
  genresMeta: [],
  hasNext: false,
  loading: false,
  error: null,
  genreType: 'genres',
  genreQueryFilter: '',
};

function mergeUniqueById(existing: any[], incoming: any[]) {
  const map = new Map<number, any>();
  existing.forEach((it) => map.set(it.mal_id ?? it.id, it));
  incoming.forEach((it) => map.set(it.mal_id ?? it.id, it));
  return Array.from(map.values());
}
// Simple inflight dedupe map per URL
const inflight = new Map<string, Promise<any>>();
async function fetchWithRetries(url: string, maxRetries = 3) {
  const baseDelay = 500;
  let attempt = 0;
  const sleep = (ms: number) => new Promise<void>((res) => setTimeout(() => res(), ms));

  while (attempt <= maxRetries) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        const retryAfter = res.headers.get('Retry-After');
        const wait = retryAfter
          ? parseFloat(retryAfter) * 1000
          : baseDelay * Math.pow(2, attempt) + Math.floor(Math.random() * 100);
        if (attempt === maxRetries) throw new Error('Too Many Requests');
        await sleep(wait);
        attempt += 1;
        continue;
      }
      if (!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      return json;
    } catch (err: any) {
      if (attempt >= maxRetries) throw err;
      const wait = baseDelay * Math.pow(2, attempt) + Math.floor(Math.random() * 100);
      await sleep(wait);
      attempt += 1;
    }
  }
  throw new Error('fetchWithRetries failed');
}

async function dedupFetch(url: string) {
  if (inflight.has(url)) return inflight.get(url);
  const p = fetchWithRetries(url).finally(() => inflight.delete(url));
  inflight.set(url, p);
  return p;
}

// keep getGenres and searchAnime thunks (used by discovery slice)
export const getGenres = createAsyncThunk('anime/getGenres', async () => {
  const url = `${baseUrl}/genres/anime`;
  const json = await dedupFetch(url);
  return json.data;
});
export const searchAnime = createAsyncThunk(
  'anime/search',
  async (payload: { query?: string; filters?: any; page?: number; limit?: number }) => {
    const { query = '', filters = {}, page = 1, limit = 20 } = payload;
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    if (filters.type) params.append('type', filters.type);
    if (filters.score) params.append('score', String(filters.score));
    // use provided genreType key (fallback to 'genres')
    const genreKey = filters.genreType || 'genres';
    if (filters.genres && Array.isArray(filters.genres) && filters.genres.length)
      params.append(genreKey, filters.genres.join(','));
    if (filters.year) params.append('year', String(filters.year));
    // ordering and safety example
    params.append('order_by', 'members');
    params.append('sort', 'desc');
    params.append('limit', String(limit));
    params.append('page', String(page));
    const url = `${baseUrl}/anime?${params.toString()}`;
    const json = await dedupFetch(url);
    return {
      data: json.data,
      page,
      hasNext: json.pagination?.has_next_page ?? false,
    };
  }
);
const slice = createSlice({
  name: 'discovery',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setFiltersVisible(state, action: PayloadAction<boolean>) {
      state.filtersVisible = action.payload;
    },
    setYear(state, action: PayloadAction<string>) {
      state.year = action.payload;
    },
    toggleGenre(state, action: PayloadAction<string>) {
      const g = action.payload;
      state.selectedGenres = state.selectedGenres.includes(g)
        ? state.selectedGenres.filter(x => x !== g)
        : [...state.selectedGenres, g];
    },
    setStudio(state, action: PayloadAction<string>) {
      state.studio = action.payload;
    },
    setMinRating(state, action: PayloadAction<string>) {
      state.minRating = action.payload;
    },
    clearFilters(state) {
      state.year = '';
      state.selectedGenres = [];
      state.studio = '';
      state.minRating = '0';
      state.genreQueryFilter = '';
    },
    setGenreType(state, action: PayloadAction<'genres' | 'explicit_genres' | 'themes' | 'demographics'>) {
      state.genreType = action.payload;
    },
    setGenreQueryFilter(state, action: PayloadAction<string>) {
      state.genreQueryFilter = action.payload;
    },
    setSearchMode(state, action: PayloadAction<'basic' | 'advanced'>) {
      state.searchMode = action.payload;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    resetAll(state) {
      state.query = '';
      state.filtersVisible = false;
      state.year = '';
      state.selectedGenres = [];
      state.studio = '';
      state.minRating = '0';
      state.searchMode = 'basic';
      state.page = 1;
      state.searchResults = [];
      state.genreType = 'genres';
      state.genreQueryFilter = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGenres.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(getGenres.fulfilled, (s, action) => {
        s.genresMeta = action.payload;
        s.loading = false;
      })
      .addCase(getGenres.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load genres';
        s.loading = false;
      })

      .addCase(searchAnime.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(searchAnime.fulfilled, (s, action) => {
        const page = action.payload.page ?? 1;
        s.searchResults = page > 1 ? mergeUniqueById(s.searchResults, action.payload.data) : action.payload.data;
        s.page = page;
        s.hasNext = !!action.payload.hasNext;
        s.loading = false;
      })
      .addCase(searchAnime.rejected, (s, action) => {
        s.error = action.error.message ?? 'Search failed';
        s.loading = false;
      });
  },
});

export const {
  setQuery,
  setFiltersVisible,
  setYear,
  toggleGenre,
  setStudio,
  setMinRating,
  clearFilters,
  setSearchMode,
  setPage,
  resetAll,
  setGenreType,
  setGenreQueryFilter,
} = slice.actions;

export default slice.reducer;
