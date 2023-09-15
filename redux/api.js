import axios from "axios";

export const API = axios.create({ baseURL: process.env.EXPO_PUBLIC_LOCAL_API_URL });
console.log("Connecting to API at:", process.env.EXPO_PUBLIC_LOCAL_API_URL);
API.defaults.withCredentials = true;

//Tournoi
export const getPublicTournaments = () =>
  API.get("/tournoi/public/getAllPublicTournament");

export const getTournamentInfoById = (tournoiId) =>
  API.get(`/tournoi/infos/${tournoiId}`);
