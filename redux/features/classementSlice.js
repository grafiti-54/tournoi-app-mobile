import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api.js";

//Récupération de tous les classements du tournoi.
export const fetchAllStanding = createAsyncThunk(
  "classement/fetchClassement",
  async (tournoiId, { rejectWithValue }) => {
    try {
      const response = await api.getAllStanding(tournoiId);
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

//Récupération d'un classement du tournoi.
export const getOneGroupStanding = createAsyncThunk(
  "classement/getOneGroupStanding",
  async ({tournoiId, groupe}, { rejectWithValue }) => {
    try {
      const response = await api.getOneStanding(tournoiId, groupe);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ msg: "Une erreur réseau est survenue." });
      }
    }
  }
);

const initialDataState = [];
const initialSingleState = [];

const classementSlice = createSlice({
  name: "classement",
  initialState: {
    data: initialDataState,
    single: initialSingleState,
    error: "",
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      //Récupération de la liste des classements du tournoi
      .addCase(fetchAllStanding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStanding.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllStanding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      })
      //Récupération d'un classement selon le numéro du groupe
      .addCase(getOneGroupStanding.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOneGroupStanding.fulfilled, (state, action) => {
        state.loading = false;
        state.single = action.payload;
      })
      .addCase(getOneGroupStanding.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default classementSlice.reducer;
