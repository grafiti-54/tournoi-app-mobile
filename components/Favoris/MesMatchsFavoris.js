import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { fetchTournamentById } from "../../redux/features/tournoiSlice";
import UserMatchList from "./../UserMatchList";
import { useSelector, useDispatch } from "react-redux";
import NoFollowTournament from './../NoFollowTournament';


const MesMatchsFavoris = () => {
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
          Mes matchs suivis{" "}
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 45, color: "#02a3fe" }}>
          TOURNOI-APP
        </Text>
      </View>
      <UserMatchList />
    </View>
  );
};

export default MesMatchsFavoris;
