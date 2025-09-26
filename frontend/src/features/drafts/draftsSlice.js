import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tickets: [],
  fsrs: [],
};

export const draftsSlice = createSlice({
  name: 'drafts',
  initialState,
  reducers: {
    saveTicketDraft: (state, action) => {
      if (!Array.isArray(state.tickets)) {
        state.tickets = [];
      }
      state.tickets.push(action.payload);
    },
    updateTicketDraft: (state, action) => {
      if (!Array.isArray(state.tickets)) {
        state.tickets = [];
        return;
      }
      const index = state.tickets.findIndex(draft => draft.id === action.payload.id);
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },
    deleteTicketDraft: (state, action) => {
      if (!Array.isArray(state.tickets)) {
        state.tickets = [];
        return;
      }
      state.tickets = state.tickets.filter(draft => draft.id !== action.payload.id);
    },
    clearTicketDrafts: (state) => {
      state.tickets = [];
    },
    saveFsrDraft: (state, action) => {
      if (!Array.isArray(state.fsrs)) {
        state.fsrs = [];
      }
      state.fsrs.push(action.payload);
    },
    updateFsrDraft: (state, action) => {
      if (!Array.isArray(state.fsrs)) {
        state.fsrs = [];
        return;
      }
      const index = state.fsrs.findIndex(draft => draft.id === action.payload.id);
      if (index !== -1) {
        state.fsrs[index] = action.payload;
      }
    },
    deleteFsrDraft: (state, action) => {
      if (!Array.isArray(state.fsrs)) {
        state.fsrs = [];
        return;
      }
      state.fsrs = state.fsrs.filter(draft => draft.id !== action.payload.id);
    },
    clearFsrDrafts: (state) => {
      state.fsrs = [];
    },
  },
});

export const {
  saveTicketDraft,
  updateTicketDraft,
  deleteTicketDraft,
  clearTicketDrafts,
  saveFsrDraft,
  updateFsrDraft,
  deleteFsrDraft,
  clearFsrDrafts,
} = draftsSlice.actions;

export default draftsSlice.reducer;