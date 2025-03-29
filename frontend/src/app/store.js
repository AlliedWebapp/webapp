import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';
import noteReducer from '../features/notes/noteSlice';
import collectionReducer from '../features/collection/collectionSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    tickets: ticketReducer,
    notes: noteReducer,
    collection: collectionReducer
  }
});