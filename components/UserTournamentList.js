import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserTournaments,
  fetchTournamentById,
  removeUserTournament,
  setCurrentTournamentId,
} from "../redux/features/tournoiSlice";
import moment from "moment-timezone";
import { useNavigation } from "@react-navigation/native";
import NoFollowTournament from "./NoFollowTournament";
import "moment/locale/fr";

//Récupération de la liste des tournois suivi par l'utilisateur en favoris.
const UserTournamentList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  moment.locale("fr");

  // Utilisez directement les tournois de l'utilisateur depuis le state Redux
  const userTournaments = useSelector((state) => state.tournoi.userTournaments);
  const tournamentsData = useSelector((state) => state.tournoi.data);
  const loading = useSelector((state) => state.tournoi.loading);
  const error = useSelector((state) => state.tournoi.error);

  // console.log("userTournaments", userTournaments);
  // console.log("tournamentsData", tournamentsData);

  useEffect(() => {
    userTournaments.forEach((tournamentId) => {
      dispatch(fetchTournamentById(tournamentId));
    });
  }, [userTournaments, dispatch]);

  //Fonction de suppression d'un tournoi de la liste.
  const handleRemoveTournament = (tournamentId) => {
    //console.log("ID du tournoi à supprimer:", tournamentId);
    Alert.alert(
      "Supprimer le tournoi",
      "Êtes-vous sûr de vouloir supprimer ce tournoi de votre liste?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => {
            //console.log("Suppression du tournoi avec l'ID:", tournamentId);
            dispatch(removeUserTournament(tournamentId));
            //console.log("Action removeUserTournament dispatchée avec l'ID:", tournamentId);
          },
        },
      ],
      { cancelable: false }
    );
  };

  //Récupération de l'id du tournoi et redirection vers le screen du tournoi.
  const handleTournamentClick = (tournamentId) => {
    // Stocke l'ID du tournoi dans le store
    dispatch(setCurrentTournamentId(tournamentId));
    // Navigue vers le nouvel écran
    navigation.navigate("Tournoi detail"); // voir le name Tab.Screen dans stackNavigator
  };

  //Suppression complete de la liste des favoris.
  const handleClearFavorites = () => {
    Alert.alert(
      "Supprimer mes tournoi",
      "Êtes-vous sûr de vouloir supprimer votre liste de tournoi?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Supprimer",
          onPress: () => {
            dispatch(clearUserTournaments());
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView style={styles.container}>
      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {userTournaments?.length === 0 && (
        <View style={{ marginTop: "33%" }}>
          <NoFollowTournament />
        </View>
      )}
      
      {userTournaments?.map((tournamentId, index) => {
        const tournament = tournamentsData[tournamentId];
        if (!tournament) {
          return (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color="#2196F3" />
            </View>
          );
        }
        return (
          <TouchableOpacity
            key={tournamentId}
            style={styles.card}
            onPress={() => handleTournamentClick(tournament.tournoi_id)}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: tournament?.imagepath }}
                style={styles.image}
                resizeMode="contain" // ou "cover" selon vos besoins
              />
            </View>
            <Text style={styles.title}>{tournament?.name}</Text>
            <Text style={styles.text}>{tournament?.adresse}</Text>
            <Text style={styles.text}>
              {moment
                .utc(tournament?.horaire_debut)
                .tz("Europe/Paris")
                .format("dddd D MMMM YYYY HH:mm")}
              {/* {moment.utc(tournament.horaire_debut).format("HH:mm")} */}
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                color="#2196F3"
                style={styles.button}
                title="Retirer ce tournoi de ma liste"
                onPress={() => handleRemoveTournament(tournament.tournoi_id)}
              />
            </View>
          </TouchableOpacity>
        );
      })}
      {userTournaments?.length > 0 && (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop:20,
          }}
        >
          <TouchableOpacity
            style={{
              width: 200,
              backgroundColor: "#2196F3", // Couleur de fond du bouton
              padding: 10, // Ajoutez le padding ici
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 4, // Pour arrondir les coins si vous le souhaitez
            }}
            onPress={handleClearFavorites}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>
              Vider mes favoris
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 50,
  },
  card: {
    backgroundColor: "#f1faff",
    marginBottom: 15,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    borderWidth: 2, // Ajoutez cette ligne
    borderColor: "#2196F3", // Ajoutez cette ligne
  },
  imageContainer: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    overflow: "hidden", // Pour s'assurer que l'image respecte le borderRadius
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export default UserTournamentList;
