import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

const baseUrl = 'https://api.jikan.moe/v4';

type AnimeState = {
  popularAnime: any[];
  upcomingAnime: any[];
  airingAnime: any[];
  topAnime: any[];
  pictures: any[];
  isSearch: boolean;
  loading: boolean;
  error: string | null;
  anime: any | null;
  characters: any[];
};

const initialState: AnimeState = {
  popularAnime: [],
  upcomingAnime: [],
  airingAnime: [],
  topAnime: [],
  pictures: [],
  isSearch: false,
  loading: false,
  error: null,
  anime: null,
  characters: [],
};

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

// helper to merge unique by mal_id
function mergeUniqueById(existing: any[], incoming: any[]) {
  const map = new Map<number, any>();
  existing.forEach((it) => map.set(it.mal_id, it));
  incoming.forEach((it) => map.set(it.mal_id, it));
  return Array.from(map.values());
}

export const getPopularAnime = createAsyncThunk(
  'anime/getPopular',
  async ({ page = 1, limit = 25 }: { page?: number; limit?: number }) => {
    const url = `${baseUrl}/top/anime?filter=bypopularity&page=${page}&limit=${limit}`;
    const json = await dedupFetch(url);
    return { data: json.data, page };
  }
);

export const getTopAnime = createAsyncThunk(
  'anime/getTop',
  async ({ page = 1, limit = 25 }: { page?: number; limit?: number }) => {
    const url = `${baseUrl}/top/anime?page=${page}&limit=${limit}`;
    const json = await dedupFetch(url);
    return { data: json.data, page };
  }
);

export const getUpcomingAnime = createAsyncThunk(
  'anime/getUpcoming',
  async ({ page = 1, limit = 25 }: { page?: number; limit?: number }) => {
    const url = `${baseUrl}/top/anime?filter=upcoming&page=${page}&limit=${limit}`;
    const json = await dedupFetch(url);
    return { data: json.data, page };
  }
);

export const getAiringAnime = createAsyncThunk(
  'anime/getAiring',
  async ({ page = 1, limit = 25 }: { page?: number; limit?: number }) => {
    const url = `${baseUrl}/top/anime?filter=airing&page=${page}&limit=${limit}`;
    const json = await dedupFetch(url);
    return { data: json.data, page };
  }
);

export const getAnime = createAsyncThunk('anime/getAnime', async (id: number | string) => {
  const url = `${baseUrl}/anime/${id}`;
  const json = await dedupFetch(url);
  return json.data;
});

export const getCharacters = createAsyncThunk('anime/getCharacters', async (id: number | string) => {
  const url = `${baseUrl}/anime/${id}/characters`;
  const json = await dedupFetch(url);
  return json.data;
});

export const getPictures = createAsyncThunk('anime/getPictures', async (id: number | string) => {
  const url = `${baseUrl}/characters/${id}/pictures`;
  const json = await dedupFetch(url);
  return json.data;
});





const slice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    setIsSearch(state, action: PayloadAction<boolean>) {
      state.isSearch = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPopularAnime.pending, (s) => ({ ...s, loading: true }))
      .addCase(getPopularAnime.fulfilled, (s, action) => {
        const page = action.payload.page ?? 1;
        s.popularAnime = page > 1 ? mergeUniqueById(s.popularAnime, action.payload.data) : action.payload.data;
        s.loading = false;
      })
      .addCase(getPopularAnime.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load popular anime';
        s.loading = false;
      })

      .addCase(getUpcomingAnime.pending, (s) => ({ ...s, loading: true }))
      .addCase(getUpcomingAnime.fulfilled, (s, action) => {
        const page = action.payload.page ?? 1;
        s.upcomingAnime = page > 1 ? mergeUniqueById(s.upcomingAnime, action.payload.data) : action.payload.data;
        s.loading = false;
      })
      .addCase(getUpcomingAnime.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load upcoming anime';
        s.loading = false;
      })

      .addCase(getAiringAnime.pending, (s) => ({ ...s, loading: true }))
      .addCase(getAiringAnime.fulfilled, (s, action) => {
        const page = action.payload.page ?? 1;
        s.airingAnime = page > 1 ? mergeUniqueById(s.airingAnime, action.payload.data) : action.payload.data;
        s.loading = false;
      })
      .addCase(getAiringAnime.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load airing anime';
        s.loading = false;
      })

      .addCase(getAnime.pending, (s) => ({ ...s, loading: true }))
      .addCase(getAnime.fulfilled, (s, action) => {
        s.anime = action.payload;
        s.loading = false;
      })
      .addCase(getAnime.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load anime';
        s.loading = false;
      })

      .addCase(getCharacters.pending, (s) => ({ ...s, loading: true }))
      .addCase(getCharacters.fulfilled, (s, action) => {
        s.characters = action.payload;
        s.loading = false;
      })
      .addCase(getCharacters.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load characters';
        s.loading = false;
      })

      .addCase(getPictures.pending, (s) => ({ ...s, loading: true }))
      .addCase(getPictures.fulfilled, (s, action) => {
        s.pictures = action.payload;
        s.loading = false;
      })
      .addCase(getPictures.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load pictures';
        s.loading = false;
      })

      .addCase(getTopAnime.pending, (s) => ({ ...s, loading: true }))
      .addCase(getTopAnime.fulfilled, (s, action) => {
        const page = action.payload.page ?? 1;
        s.topAnime = page > 1 ? mergeUniqueById(s.topAnime, action.payload.data) : action.payload.data;
        s.loading = false;
      })
      .addCase(getTopAnime.rejected, (s, action) => {
        s.error = action.error.message ?? 'Failed to load top anime';
        s.loading = false;
      })

  
  },
});

export const { clearError, setIsSearch } = slice.actions;
export default slice.reducer;
