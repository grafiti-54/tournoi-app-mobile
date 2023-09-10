import axios from "axios";

export const API = axios.create({ baseURL: process.env.REACT_APP_API_URL });
API.defaults.withCredentials = true;

//Tournoi
export const getPublicUpcomingTournaments = () =>
  API.get("/tournoi/public/getPublicUpcomingTournaments");
