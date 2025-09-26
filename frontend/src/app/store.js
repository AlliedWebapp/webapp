import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/auth/authSlice';
import ticketReducer from '../features/tickets/ticketSlice';
import noteReducer from '../features/notes/noteSlice';
import collectionReducer from '../features/collection/collectionSlice';
import draftsReducer from '../features/drafts/draftsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tickets: ticketReducer,
  notes: noteReducer,
  collection: collectionReducer,
  drafts: draftsReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['drafts'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);
