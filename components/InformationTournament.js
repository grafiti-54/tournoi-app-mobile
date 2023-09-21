import React, { useEffect } from "react";
import { ScrollView, View, Text, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchTournamentById } from "../redux/features/tournoiSlice";
import NoFollowTournament from "./NoFollowTournament";
import moment from "moment-timezone";
import "moment/locale/fr";

const InformationTournament = ({ currentTournamentId }) => {
  const dispatch = useDispatch();
  const tournoi = useSelector(
    (state) => state.tournoi.data[currentTournamentId]
  );
  moment.locale("fr");

  //Récupération du tournoi.
  useEffect(() => {
    dispatch(fetchTournamentById(currentTournamentId));
  }, [currentTournamentId, dispatch]);

  if (!tournoi) {
    return (
      <NoFollowTournament/>
    );
  }

  return (
    <ScrollView>
      {/* <Text>Information du tournoi avec l'id {currentTournamentId}</Text> */}
      <Text style={styles.titre}>{tournoi?.name}</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: tournoi?.imagepath }}
          style={styles.image}
          resizeMode="contain" // ou "cover" selon vos besoins
        />
        <Text style={styles.titre}>{tournoi?.adresse}</Text>
      </View>
      <View style={styles.card}>
      <Text>{tournoi?.adresse}</Text>
        <Text>{moment
                .utc(tournoi?.horaire_debut)
                .tz("Europe/Paris")
                .format("dddd D MMMM YYYY HH:mm")}</Text>
        <Text>Format du tournoi : {tournoi?.tournamentType} </Text>
        <Text>Nombre de participants : {tournoi?.nombre_equipe} équipes </Text>
        <Text>Durée des matchs : {tournoi?.match_duree} minutes  </Text>
        <Text>Nombre de terrains : {tournoi?.nombre_terrain} </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titre: {
    marginLeft: "auto",
    marginRight: "auto",
    //width: width > 600 ? width * 0.66 : width, // Ceci est une approximation pour sm et xs. Vous devrez peut-être ajuster les points de rupture.
    fontSize: 22,
    padding: 30,
    textAlign: "center",
    marginBottom: 35,
    marginTop: 15,
    backgroundColor: "#090915", 
    color: "white", 
    borderWidth: 3,
    borderRadius: 5,
    padding: 10, 
    borderColor: "#02a3fe", 
    shadowColor: "rgba(2, 163, 254, 0.2)",
    shadowOffset: { width: 2, height: 3 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5, // Pour Android
  },
  imageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    overflow: "hidden", // Pour s'assurer que l'image respecte le borderRadius
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  card: {
    width:"90%",
    marginRight:"auto",
    marginLeft:"auto",
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
