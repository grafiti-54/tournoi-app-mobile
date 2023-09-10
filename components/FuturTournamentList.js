import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicUpcomingTournaments } from "../redux/features/tournoiSlice.js";

const FuturTournamentList = () => {
  const dispatch = useDispatch();
  const tournaments = useSelector((state) => state?.tournoi?.upcoming);
  const searchValue = useSelector((state) => state.tournoi.searchValue);

  useEffect(() => {
    dispatch(fetchPublicUpcomingTournaments());
  }, []);

  // const filteredTournaments = tournaments?.filter((tournament) =>
  //   tournament.name.toLowerCase().includes(searchValue.toLowerCase())
  // );

  return (
    <View>
      {tournaments?.map((tournament) => (
        <Text
          style={{ color: "black", fontSize: 16 }}
          key={tournament.tournoi_id}
        >
          {tournament.name}
        </Text>
      ))}
    </View>
  );
};

export default FuturTournamentList;
