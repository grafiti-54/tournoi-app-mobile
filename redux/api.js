import axios from "axios";

export const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_LOCAL_API_URL,
});
console.log("Connecting to API at:", process.env.EXPO_PUBLIC_LOCAL_API_URL);
API.defaults.withCredentials = true;

//Tournoi
export const getPublicTournaments = () =>
  API.get("/tournoi/public/getAllPublicTournament");

export const getTournamentInfoById = (tournoiId) =>
  API.get(`/tournoi/infos/${tournoiId}`);

//Match
export const getAllMatch = (tournoiId) =>
  API.get(`/match/allTournamentMatch/${tournoiId}`);

export const getMatchDetails = (matchId) =>
  API.get(`/match/matchDetailsById/${matchId}`);

//Classement
export const getAllStanding = (tournoiId) =>
  API.get(`/standing/all/${tournoiId}`);
export const getOneStanding = (tournoiId, groupe) =>
  API.get(`/standing/one/${tournoiId}/${groupe}`);

//Notifications
export const subscribeToMatchNotifications = (matchId, token) =>
  API.patch(`/favoris/updateFavoris`, { matchId, token });
