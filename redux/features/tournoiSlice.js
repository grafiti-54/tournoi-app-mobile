import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api.js";

//Récupération de tous les futurs tournois public.
export const fetchPublicTournaments = createAsyncThunk(
  "tournoi/fetchPublicTournaments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPublicTournaments();
      console.log("Données renvoyées par l'API:", response.data);
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

// Récupération des informations d'un tournoi
export const fetchTournamentById = createAsyncThunk(
  "tournoi/fetchTournamentById",
  async (tournoiId, { rejectWithValue }) => {
    try {
      const response = await api.getTournamentInfoById(tournoiId);
      if (response.data && response.data.tournoi) {
        console.log(response.data)
        return response.data.tournoi;
      } else {
        return rejectWithValue({ msg: "Aucun tournoi trouvé avec cet ID." });
      }
    } catch (error) {
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ msg: "Une erreur réseau est survenue." });
      }
    }
  }
);

const tournoiSlice = createSlice({
  name: "tournoi",
  initialState: {
    data: {},
    userTournaments: [],
    currentTournamentId: null, //id du tournoi consulté par l'utilisateur.
    error: null,
    loading: false,
    searchValue: "",
  },
  reducers: {
    setCurrentTournamentId: (state, action) => {
      state.currentTournamentId = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    addUserTournament: (state, action) => {
      const tournamentIdToAdd = String(action.payload);
      if (!state.userTournaments.includes(tournamentIdToAdd)) {
        state.userTournaments.push(tournamentIdToAdd);
      }
    },

    removeUserTournament: (state, action) => {
      // Convertir l'ID en chaîne de caractères pour la comparaison
      const tournamentIdToRemove = String(action.payload);

      const updatedTournaments = state.userTournaments.filter(
        (tournamentId) => tournamentId !== tournamentIdToRemove
      );

      state.userTournaments = updatedTournaments;
      //console.log("État de userTournaments après suppression:", state.userTournaments);
    },
    clearUserTournaments: (state) => {
      state.userTournaments = [];
      state.currentTournamentId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      //Récupération des tounois publics.
      .addCase(fetchPublicTournaments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicTournaments.fulfilled, (state, action) => {
        state.loading = false;
        action.payload.forEach((tournament) => {
          state.data[tournament.tournoi_id] = tournament;
        });
      })

      .addCase(fetchPublicTournaments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      })
      //Récupération des informations d'un tournoi selon son id.
      .addCase(fetchTournamentById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTournamentById.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.tournoi_id] = action.payload;
      })

      .addCase(fetchTournamentById.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.msg) {
          state.error = action.payload.msg;
        } else if (action.error && action.error.message) {
          state.error = action.error.message;
        } else {
          state.error = null;
        }
      });
  },
});

export const {setCurrentTournamentId, setSearchValue, addUserTournament, removeUserTournament, clearUserTournaments } =
  tournoiSlice.actions;
export default tournoiSlice.reducer;
