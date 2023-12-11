import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';

import TournoiReducer from './features/tournoiSlice.js';
import MatchReducer from "./features/matchSlice.js";
import ClassementReducer from "./features/classementSlice.js";
import NotificationReducer from "./features/notificationSlice.js";

import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration pour la persistance des données.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['tournoi', 'match', 'classement','notification'],
};

// Combinaison des différents réducteurs en un seul
const rootReducer = combineReducers({
  tournoi: TournoiReducer,
  match: MatchReducer,
  classement: ClassementReducer,
  notification: NotificationReducer
});

// Création d'un réducteur persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configuration du store Redux
export const store = configureStore({
  reducer: persistedReducer,  // Utilisation du réducteur persistant
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Certaines actions générées par Redux Persist peuvent ne pas être sérialisables
        ignoredActions: ['persist/PERSIST'],  // Actions à ignorer pour la sérialisation
      },
    }),
  devTools: process.env.EXPO_PUBLIC_NODE_ENV !== 'production',
});
export const persistor = persistStore(store);


