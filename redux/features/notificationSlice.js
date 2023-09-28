import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as api from "../api.js";

// Ajout/suppression d'un match en favoris pour les notifications.
export const handleUserNotification = createAsyncThunk(
  "notification/updateNotification",
  async ({ matchId, token }, { rejectWithValue }) => {
    try {
      // Affichez les paramètres d'entrée
      console.log("matchId:", matchId);
      console.log("token:", token);

      // Appel de l'API et affichage de la réponse
      const response = await api.subscribeToMatchNotifications(matchId, token);
      console.log("API Response:", response);

      // Affichage de la valeur de retour
      console.log("Returning Data:", response.data);
      return response.data;
    } catch (error) {
      // Affichage de l'erreur
      console.error("API Error:", error);

      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ msg: "Une erreur réseau est survenue." });
      }
    }
  }
);


const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    loading: false,
    error: null,
    data: null, // vous pouvez stocker la réponse du serveur ici
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(handleUserNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleUserNotification.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload; // stockez la réponse du serveur ici
      })
      .addCase(handleUserNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload
          ? action.payload.msg
          : "Une erreur inconnue est survenue.";
      });
  },
});

export default notificationSlice.reducer;

