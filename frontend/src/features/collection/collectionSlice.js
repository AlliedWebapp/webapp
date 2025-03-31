import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching collection data
export const fetchCollection = createAsyncThunk(
  'collection/fetchCollection',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/:collection'); // Update with your actual API
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Async Thunk for updating a collection item
export const updateCollectionItem = createAsyncThunk(
  'collection/updateCollectionItem',
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/:collection/${id}`, updatedData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// Create Slice
const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    // Reducer for adding an item locally
    addCollectionItem: (state, action) => {
      state.items.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Collection
      .addCase(fetchCollection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollection.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCollection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Collection Item
      .addCase(updateCollectionItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

// Export Actions & Reducer
export const { addCollectionItem } = collectionSlice.actions;
export default collectionSlice.reducer;
