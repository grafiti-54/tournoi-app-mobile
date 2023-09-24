import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetchTournamentById } from "../../redux/features/tournoiSlice";
import { useDispatch, useSelector } from "react-redux";
import NoFollowTournament from "../NoFollowTournament";
import UserTournamentList from "../UserTournamentList";
import { useNavigation } from "@react-navigation/native";

const MesTournoisFavoris = () => {
  const currentTournamentId = useSelector(
    (state) => state.tournoi.currentTournamentId
  );
  const tournoi = useSelector(
    (state) => state.tournoi.data[currentTournamentId]
  );
  const dispatch = useDispatch();

  //Vérification si récupération d'un tournoi.
  useEffect(() => {
    dispatch(fetchTournamentById(currentTournamentId));
  }, [currentTournamentId, dispatch]);

  if (!tournoi) {
    return <NoFollowTournament />;
  }
  return (
    <View
      style={{
        display: "flex",
        justifyContent: "space-around",
      }}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 26,
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 35 }}>
          Mes tournois suivis{" "}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 45, color: "#02a3fe" }}>
          TOURNOI-APP
        </Text>
      </View>
      <UserTournamentList />
    </View>
  );
};

export default MesTournoisFavoris;
