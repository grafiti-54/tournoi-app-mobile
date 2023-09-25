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
    single: [],
    userMatchs: [], //liste des id des matchs suivi par l'utilisateur.
    currentMatchId: null,
    error: null,
    loading: false,
  },
  reducers: {
    //Ajout d'un match dans la liste des matchs suivi par l'utilisateur. (favoris/notifications)
    toggleUserMatch: (state, action) => {
      //console.log("Action reçue:", action);
      const matchId = action.payload;
      const index = state.userMatchs.indexOf(matchId);
      if (index >= 0) {
        // Si le match est déjà dans les favoris, le supprimer
        state.userMatchs.splice(index, 1);
      } else {
        // Sinon, l'ajouter aux favoris
        state.userMatchs.push(matchId);
      }
    },
    clearUserMatchs: (state) => {
      state.userMatchs = []; // Réinitialisez le tableau des matchs suivis par l'utilisateur
    },
    //Modification du status live d'un match dans la liste.
    updateMatchLiveLocally: (state, action) => {
      const matchToUpdate = state.data.find(
        (match) => match.match_id === action.payload.matchId
      );
      if (matchToUpdate) {
        matchToUpdate.is_live = action.payload.isLive;
      }
      // Mise à jour du live d'un match individuel
      if (state.single.match_id === action.payload.matchId) {
        state.single.is_live = action.payload.isLive;
      }
    },
    //Modification du score d'un match dans la liste
    updateMatchScoreLocally: (state, action) => {
      const matchToUpdate = state.data.find(
        (match) => match.match_id === action.payload.matchId
      );
      if (matchToUpdate) {
        if (action.payload.isHomeTeam) {
          matchToUpdate.dom_equipe_score = action.payload.newValue;
        } else {
          matchToUpdate.ext_equipe_score = action.payload.newValue;
        }
      }
      // Mise à jour du score du match individuel
      if (state.single.match_id === action.payload.matchId) {
        if (action.payload.isHomeTeam) {
          state.single.dom_equipe_score = action.payload.newValue;
        } else {
          state.single.ext_equipe_score = action.payload.newValue;
        }
      }
    },
    validateMatchScoreLocally: (state, action) => {
      // Mise à jour du score du match dans la liste
      const matchToUpdate = state.data.find(
        (match) => match.match_id === action.payload.matchId
      );
      if (matchToUpdate) {
        matchToUpdate.dom_equipe_score = action.payload.dom_equipe_score;
        matchToUpdate.ext_equipe_score = action.payload.ext_equipe_score;
        matchToUpdate.is_validated = action.payload.is_validated;
      }
      // Mise à jour du score du match individuel
      if (state.single.match_id === action.payload.matchId) {
        state.single.dom_equipe_score = action.payload.dom_equipe_score;
        state.single.ext_equipe_score = action.payload.ext_equipe_score;
        state.single.is_validated = action.payload.is_validated;
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
      //state.data[action.payload.match_id] = action.payload;
      
      })
      .addCase(fetchMatchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      })
      ;
  },
});
export const {
  updateMatchLiveLocally,
  updateMatchScoreLocally,
  validateMatchScoreLocally,
  toggleUserMatch,
  clearUserMatchs,
  
} = matchSlice.actions;
export default matchSlice.reducer;
