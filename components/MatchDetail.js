import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMatchDetails,
  updateMatchLiveLocally,
  updateMatchScoreLocally,
  validateMatchScoreLocally,
} from "../redux/features/matchSlice";
import moment from "moment";
import io from "socket.io-client";

//Modal de détail du match lors de la selection dans la liste des matchs du tournoi
const MatchDetail = ({ matchId }) => {
  //console.log("id du match récupéré : ",matchId);
  const dispatch = useDispatch();
  const matchDetails = useSelector((state) => state?.match?.single);
  const loading = useSelector((state) => state.match.loading);
  const error = useSelector((state) => state.match.error);

  useEffect(() => {
    dispatch(fetchMatchDetails(matchId));
  }, [dispatch, matchId]);
  //console.log(matchDetails);

  useEffect(() => {
    const socket = io.connect(process.env.EXPO_PUBLIC_LOCAL_API_URL);
    socket.on("liveMatchUpdated", (data) => {
      // Vérifie si l'ID du match mis à jour correspond à l'ID du match actuel
      if (data.matchId === matchId) {
        dispatch(updateMatchLiveLocally(data));
      }
    });
    socket.on("scoreUpdated", (data) => {
      // Vérifie si l'ID du match mis à jour correspond à l'ID du match actuel
      if (data.matchId === matchId) {
        dispatch(updateMatchScoreLocally(data));
      }
    });

    socket.on("matchScoreValidated", (data) => {
      // Vérifie si l'ID du match mis à jour correspond à l'ID du match actuel
      if (data.matchId === matchId) {
        dispatch(
          validateMatchScoreLocally({
            matchId: data.match_id,
            dom_equipe_score: data.dom_equipe_score,
            ext_equipe_score: data.ext_equipe_score,
            is_validated: data.is_validated,
          })
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, matchId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <Text>Erreur: {error}</Text>
      ) : (
        <>
          {/* Header match */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{matchDetails?.Terrain?.name}</Text>
          </View>

          {/* Container match */}
          <View style={styles.matchContainer}>
            {/* Container equipe domicile + logo */}
            <View style={styles.teamContainer}>
              <Image
                source={{ uri: matchDetails?.Domicile?.logopath }}
                style={styles.logo}
              />
              <Text style={styles.teamName}>
                {matchDetails?.Domicile?.name || "Nom par défaut"}
              </Text>
            </View>

            {/* Container score ou date */}
            <View style={styles.scoreContainer}>
              {matchDetails?.is_live || matchDetails?.is_validated ? (
                <View style={styles.horizontalScoreContainer}>
                  <Text style={styles.score}>
                    {matchDetails?.dom_equipe_score}
                  </Text>
                  <Text style={styles.scoreSeparator}> - </Text>
                  <Text style={styles.score}>
                    {matchDetails?.ext_equipe_score}
                  </Text>
                </View>
              ) : (
                <Text style={styles.time}>
                  {matchDetails?.horaire
                    ? moment.utc(matchDetails?.horaire).format("HH:mm")
                    : "-"}
                </Text>
              )}
            </View>

            {/* Container équipe extérieur + logo */}
            <View style={styles.teamContainer}>
              <Image
                source={{ uri: matchDetails?.Exterieur?.logopath }}
                style={styles.logo}
              />
              <Text style={styles.teamName}>
                {matchDetails?.Exterieur?.name || "Nom par défaut"}
              </Text>
            </View>
          </View>

          {/* Footer match */}
          <View style={styles.footer}>
            {matchDetails?.is_live ? (
              <Text style={styles.live}>Live</Text>
            ) : matchDetails?.is_validated ? (
              <Text>Terminé</Text>
            ) : (
              <>
                <Text>
                  {matchDetails?.horaire
                    ? moment.utc(matchDetails?.horaire).format("DD/MM/YYYY")
                    : "à définir"}
                </Text>
                {matchDetails?.horaire && (
                  <Text>
                    {moment().isAfter(moment.utc(matchDetails?.horaire))
                      ? "En attente du résultat. A eu lieu il y a "
                      : "Commence dans "}
                    {moment
                      .duration(
                        moment.utc(matchDetails?.horaire).diff(moment())
                      )
                      .humanize()}
                  </Text>
                )}
              </>
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    backgroundColor: "#000",
    marginBottom: "3%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    padding: 10,
    borderColor: "#02a3fe",
    borderWidth: 3,
    shadowColor: "#02a3fe",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerText: {
    color: "#fff",
    textAlign: "center",
  },
  matchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    maxHeight: "50%",
  },
  teamContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  teamName: {
    marginTop: 9,
    fontSize: 15,
    textAlign: "center",
  },
  scoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  horizontalScoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  score: {
    fontSize: 24,
  },
  scoreSeparator: {
    fontSize: 24,
    marginHorizontal: 10, 
  },
  time: {
    fontSize: 24,
  },
  footer: {
    marginTop: "5%",
    justifyContent: "center",
    alignItems: "center",
  },
  live: {
    fontSize: 12,
    color: "red",
  },
});

export default MatchDetail;
