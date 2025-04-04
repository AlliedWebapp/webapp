import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import ticketService from './ticketService'

const initialState = {
  tickets: [],
  ticket: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: ''
}

// Create new ticket
/**
 * createAsyncThunk: A function that accepts a Redux action type string and
 * a callback function that should return a promise.
 * It generates promise lifecycle action types based
 * on the action type prefix that you pass in,
 * and returns a thunk action creator that will
 * run the promise callback and dispatch the
 * lifecycle actions based on the returned promise.
 * This abstracts the standard recommended approach for handling async request lifecycles.
 */
export const createTicket = createAsyncThunk(
  'tickets/create',
  async (ticketData, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.createTicket(ticketData, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user tickets
export const getTickets = createAsyncThunk(
  'tickets/getAll',
  async (_, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.getTickets(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get user ticket
export const getTicket = createAsyncThunk(
  'tickets/get',
  async (ticketId, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      const token = thunkAPI.getState().auth.user.token;
      const response = await ticketService.getTicket(ticketId, token);
      console.log("API Response:", response);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Close ticket
export const closeTicket = createAsyncThunk(
  'tickets/close',
  async (ticketId, thunkAPI) => {
    /**
     * thunkAPI: an object containing all of the parameters
     * that are normally passed to a Redux thunk function,
     * as well as additional options: https://redux-toolkit.js.org/api/createAsyncThunk
     */
    try {
      // Token is required for authentication
      const token = thunkAPI.getState().auth.user.token
      return await ticketService.closeTicket(ticketId, token) // Service function
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()

      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    reset: (state) => {
      // Don't reset tickets array to maintain list state
      state.ticket = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createTicket.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(createTicket.fulfilled, state => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
      })
      .addCase(createTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTickets.pending, state => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(getTickets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.tickets = action.payload;
      })
      .addCase(getTickets.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getTicket.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.ticket = action.payload;
      })
      .addCase(getTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.ticket = null;
        state.message = action.payload;
      })
      .addCase(closeTicket.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(closeTicket.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        // Update the current ticket
        if (state.ticket && state.ticket._id === action.payload._id) {
          state.ticket = action.payload;
        }
        // Update the ticket in the tickets array if it exists
        if (state.tickets && Array.isArray(state.tickets)) {
          state.tickets = state.tickets.map(ticket =>
            ticket._id === action.payload._id ? action.payload : ticket
          );
        }
      })
      .addCase(closeTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
  }
})

export const { reset } = ticketSlice.actions
export default ticketSlice.reducer
