import React, { useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicTournaments } from "../redux/features/tournoiSlice.js";

//Affichage de la liste des tournois a venir dans le menu de recherche.
const FuturTournamentList = () => {
  const dispatch = useDispatch();
  const tournaments = useSelector((state) => state?.tournoi?.data);
  const searchValue = useSelector((state) => state.tournoi.searchValue);

  useEffect(() => {
    dispatch(fetchPublicTournaments());
  }, []);

  const filteredTournaments = useMemo(() => {
    if (searchValue.length < 2) {
      return [];
    }

    const results = tournaments?.filter((tournament) =>
      tournament.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      tournament.adresse.toLowerCase().includes(searchValue.toLowerCase())
    );

    return results.slice(0, 5); // Limite à 5 résultats
  }, [tournaments, searchValue]);

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 5,
        width: "80%",
        alignSelf: "center",
      }}
    >
       {filteredTournaments.length > 0 ? (
        filteredTournaments.map((tournament) => (
          <Text
            style={{ color: "black", fontSize: 16, padding: 8 }}
            key={tournament.tournoi_id}
          >
            {tournament.name}
          </Text>
        ))
      ) : searchValue.length >= 4 ? (
        <Text style={{ color: "gray", fontSize: 16, padding: 8, textAlign: "center" }}>
          Aucun résultat trouvé.
        </Text>
      ) : null}
    </View>
  );
};

export default FuturTournamentList;
