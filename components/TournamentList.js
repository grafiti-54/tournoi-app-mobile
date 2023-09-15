import React, { useEffect, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
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
        backgroundColor: "white",
        borderRadius: 5,
        width: "80%",
        alignSelf: "center",
      }}
    >
      {filteredTournaments?.length > 0 ? (
        filteredTournaments?.map((tournament) => (
          <TouchableOpacity
            key={tournament.tournoi_id}
            onPress={() => handleTournamentClick(tournament.tournoi_id)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ color: "black", fontSize: 16, padding: 8 }}>
                {tournament.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))
      ) : searchValue.length >= 4 ? (
        <Text
          style={{
            color: "gray",
            fontSize: 16,
            padding: 8,
            textAlign: "center",
          }}
        >
          Aucun résultat trouvé.
        </Text>
      ) : null}
    </View>
  );
};

export default TournamentList;
