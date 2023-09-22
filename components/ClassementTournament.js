import React from "react";
import { ScrollView, Text } from "react-native";
import ChampionnatClassement from "./ClassementType/ChampionnatClassement";
import AllerSimpleTableau from "./ClassementType/AllerSimpleTableau";
import AllerRetourTableau from "./ClassementType/AllerRetourTableau";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStanding } from "../redux/features/classementSlice";
import { useEffect } from "react";

const ClassementTournament = ({ currentTournamentId, tournamentType }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.classement.data);
  const tournoiId = currentTournamentId;
  useEffect(() => {
    dispatch(fetchAllStanding(tournoiId));
  }, [tournoiId, dispatch]);

  // console.log("id tournoi pour classement :", tournoiId);
  // console.log("classement",data);

  return (
    <ScrollView>
      {tournamentType === "championnat" &&
        Object.entries(data.groups || {}).map(([groupId, group], index) => {
          return (
            <ChampionnatClassement
              key={groupId}
              group={group}
              groupId={groupId}
              tournoiId={currentTournamentId}
            />
          );
        })}
      {tournamentType === "elimination" && <AllerSimpleTableau />}
      {tournamentType === "elimination-aller-retour" && <AllerRetourTableau />}
    </ScrollView>
  );
};

export default ClassementTournament;
