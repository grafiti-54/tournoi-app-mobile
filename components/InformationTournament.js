import React, { useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTournamentById } from "../redux/features/tournoiSlice";
import NoFollowTournament from "./NoFollowTournament";
import moment from "moment-timezone";
import "moment/locale/fr";
import { GlobalStyle } from "./styles/GlobalStyle";

//Composant d'informations sur le tournoi ( date, adresse, logo ...).
const InformationTournament = ({ currentTournamentId }) => {
  const dispatch = useDispatch();
  const tournoi = useSelector(
    (state) => state.tournoi.data[currentTournamentId]
  );
  const loading = useSelector((state) => state.tournoi.loading);
  const error = useSelector((state) => state.tournoi.error);
  moment.locale("fr");

  //Récupération du tournoi.
  useEffect(() => {
    dispatch(fetchTournamentById(currentTournamentId));
  }, [currentTournamentId, dispatch]);

  if (!tournoi) {
    return <NoFollowTournament />;
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <ScrollView>
            {/* <Text>Information du tournoi avec l'id {currentTournamentId}</Text> */}
            <Text style={styles.titre}>{tournoi?.name}</Text>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: tournoi?.imagepath }}
                style={styles.image}
                resizeMode="contain" // ou "cover" selon vos besoins
              />
            </View>
            <View style={[GlobalStyle.shadow, styles.card]}>
              <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                {moment
                  .utc(tournoi?.horaire_debut)
                  .tz("Europe/Paris")
                  .format("dddd D MMMM YYYY HH:mm")}
              </Text>
              <Text
                style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}
              >
                {tournoi?.adresse}
              </Text>
              <View>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Discipline:</Text>{" "}
                  {tournoi?.sport}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Format du tournoi :
                  </Text>{" "}
                  {tournoi?.tournamentType}
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Nombre de participants :
                  </Text>{" "}
                  {tournoi?.nombre_equipe} équipes
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>Durée des matchs :</Text>{" "}
                  {tournoi?.match_duree} minutes
                </Text>
                <Text>
                  <Text style={{ fontWeight: "bold" }}>
                    Nombre de terrains :
                  </Text>{" "}
                  {tournoi?.nombre_terrain}
                </Text>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  titre: {
    marginLeft: "auto",
    marginRight: "auto",
    //width: width > 600 ? width * 0.66 : width, // Ceci est une approximation pour sm et xs. Vous devrez peut-être ajuster les points de rupture.
    fontSize: 23,
    padding: 10,
    textAlign: "center",
    marginBottom: 35,
    marginTop: 15,
    backgroundColor: "#090915",
    color: "white",
    borderWidth: 5,
    borderRadius: 15,
    borderColor: "#02a3fe",
    shadowColor: "rgba(2, 163, 254, 0.2)",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Pour Android
  },
  imageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    overflow: "hidden", // Pour s'assurer que l'image respecte le borderRadius
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  card: {
    width: "90%",
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#f1faff",
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2, // Ajoutez cette ligne
    borderColor: "#2196F3", // Ajoutez cette ligne
  },
});

export default InformationTournament;
