import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TournoiReducer from './features/tournoiSlice.js';
import MatchReducer from "./features/matchSlice.js";
import ClassementReducer from "./features/classementSlice.js";
import NotificationReducer from "./features/notificationSlice.js";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['tournoi', 'match', 'classement','notification'],
};

const rootReducer = combineReducers({
  tournoi: TournoiReducer,
  match: MatchReducer,
  classement: ClassementReducer,
  notification: NotificationReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
    devTools: process.env.EXPO_PUBLIC_NODE_ENV !== 'production',
});

export const persistor = persistStore(store);


