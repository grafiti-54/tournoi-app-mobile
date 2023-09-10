import { configureStore } from "@reduxjs/toolkit";
import TournoiReducer from "./features/tournoiSlice.js"

//Création du store de l'application.
export default configureStore({ reducer: { tournoi: TournoiReducer } });
