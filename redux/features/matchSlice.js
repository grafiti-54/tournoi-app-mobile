import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api.js";

//Récupération de tous les matchs du tournoi.
export const fetchAllMatch = createAsyncThunk(
  "match/fetchAllMatch",
  async (tournoiId, { rejectWithValue }) => {
    try {
      const response = await api.getAllMatch(tournoiId);
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

//Récupération des informations d'un match selon son id.
export const fetchMatchDetails = createAsyncThunk(
  "match/fetchMatchDetails",
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await api.getMatchDetails(matchId); // Assurez-vous que cette fonction existe dans votre API client
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

const matchSlice = createSlice({
  name: "match",
  initialState: {
    data: {},
    currentMattchId: null,
    error: null,
    loading: false,
  },
  reducers: {
    updateMatchLiveLocally: (state, action) => {
      const matchToUpdate = state.data.find(
        (match) => match.match_id === action.payload.matchId
      );
      if (matchToUpdate) {
        matchToUpdate.is_live = action.payload.isLive;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      //Récupération de la liste des matchs du tournoi
      .addCase(fetchAllMatch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMatch.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllMatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      })
      // Récupération des détails d'un match spécifique
      .addCase(fetchMatchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload; // Mettre à jour le state avec les détails du match
      })
      .addCase(fetchMatchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      });
  },
});
export const { updateMatchLiveLocally } = matchSlice.actions;
export default matchSlice.reducer;