import axios from "axios";

export const API = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_URL });
console.log("Connecting to API at:", process.env.EXPO_PUBLIC_API_URL);
API.defaults.withCredentials = true;

//Tournoi
export const getPublicUpcomingTournaments = () =>
  API.get("/tournoi/public/getPublicUpcomingTournaments");
