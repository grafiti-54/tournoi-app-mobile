import React, { useEffect, useMemo } from "react";
import { Text, TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addUserTournament,
  fetchPublicTournaments,
  setCurrentTournamentId,
} from "../redux/features/tournoiSlice.js";
import { useNavigation } from "@react-navigation/native";

//Affichage de la liste des tournois a venir dans le menu de recherche.
const TournamentList = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const tournaments = useSelector((state) => state?.tournoi?.data);
  const searchValue = useSelector((state) => state.tournoi.searchValue);

  useEffect(() => {
    dispatch(fetchPublicTournaments());
  }, []);

  const tournamentsArray = Object.values(tournaments);

  const filteredTournaments = useMemo(() => {
    if (searchValue.length < 2) {
      return [];
    }

    const results = tournamentsArray.filter(
      (tournament) =>
        tournament?.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        tournament?.adresse.toLowerCase().includes(searchValue.toLowerCase())
    );

    return results.slice(0, 5); // Limite à 5 résultats
  }, [tournaments, searchValue]);

  //Récupération de l'id du tournoi et redirection vers le screen du tournoi.
  const handleTournamentClick = (tournamentId) => {
    // Stocke l'ID du tournoi dans le store
    dispatch(setCurrentTournamentId(tournamentId));
    //Rajoute le tournoi dans la liste des tournoi suivi par l'utilisateur.
    dispatch(addUserTournament(tournamentId));
    // Navigue vers le nouvel écran
    navigation.navigate("Tournoi detail"); // voir le name Tab.Screen dans stackNavigator
  };

  return (
    <View
      style={{
        backgroundColor: "#ccedff",
        borderRadius: 5,
        width: "80%",
        alignSelf: "center",
        marginTop: 5,
        borderWidth: 1,
        borderColor: "#9d9da1",
      }}
    >
      {filteredTournaments?.length > 0 ? (
        filteredTournaments?.map((tournament) => (
          <TouchableOpacity
            key={tournament.tournoi_id}
            onPress={() => handleTournamentClick(tournament.tournoi_id)}
            style={{
              marginBottom: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "white",
              }}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: tournament?.imagepath }}
                  style={styles.image}
                  resizeMode="contain" // ou "cover" selon vos besoins
                />
              </View>
              <View style={{width:"80%"}}>
                <Text style={{ fontWeight:"bold", fontSize: 14 }}>
                  {tournament.name}
                </Text>
                <Text style={{fontSize:12, marginTop:5}}>{tournament.adresse}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      ) : searchValue.length >= 4 ? (
        <Text
          style={{
            color: "gray",
            fontSize: 16,
            padding: 12,
            textAlign: "center",
          }}
        >
          Aucun résultat trouvé.
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    marginTop: 15,
    width: "20%",
    height: 45,
    overflow: "hidden",
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default TournamentList;
