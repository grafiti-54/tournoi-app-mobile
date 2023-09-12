import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TournoiReducer from './features/tournoiSlice.js';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['tournoi'],
};

const rootReducer = combineReducers({
  tournoi: TournoiReducer,
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
});

export const persistor = persistStore(store);


// import { configureStore } from "@reduxjs/toolkit";
// import TournoiReducer from "./features/tournoiSlice.js"

// //Création du store de l'application.
// export default configureStore({ reducer: { tournoi: TournoiReducer } });

