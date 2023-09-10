import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api.js";

//Récupération de tous les futurs tournois public.
export const fetchPublicUpcomingTournaments = createAsyncThunk(
  "tournoi/fetchPublicUpcomingTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPublicUpcomingTournaments();
      console.log("response serveur", response);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ msg: "Une erreur réseau est survenue." });
      }
    }
  }
);

//Récupération de tous les anciens tournois public.
export const fetchPublicPastTournaments = createAsyncThunk(
  "tournoi/fetchPublicPastTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPublicPastTournaments();
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ msg: "Une erreur réseau est survenue." });
      }
    }
  }
);

const initialDataState = [];
const initialSingleState = {};

const tournoiSlice = createSlice({
  name: "tournoi",
  initialState: {
    data: initialDataState,
    upcoming: initialDataState,
    past: initialDataState,
    single: initialSingleState,
    error: null,
    loading: false,
    searchValue: "",
  },
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      //Récupération des tounois futur.
      .addCase(fetchPublicUpcomingTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicUpcomingTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.upcoming = action.payload;
      })
      .addCase(fetchPublicUpcomingTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      })
      //Récupération des tournoi déjà terminé.
      .addCase(fetchPublicPastTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPastTournaments.fulfilled, (state, action) => {
        state.loading = false;
        state.past = action.payload; // Mettre à jour `past` ici
      })
      .addCase(fetchPublicPastTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      });
  },
});

export const { setSearchValue } = tournoiSlice.actions;
export default tournoiSlice.reducer;
