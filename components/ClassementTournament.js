import React from "react";
import { ScrollView, Text } from "react-native";
import ChampionnatClassement from "./ClassementType/ChampionnatClassement";
import AllerSimpleTableau from "./ClassementType/AllerSimpleTableau";
import AllerRetourTableau from "./ClassementType/AllerRetourTableau";

const ClassementTournament = ({ currentTournamentId, tournamentType }) => {
  
  return (
    <ScrollView>
      {tournamentType === "championnat" && <ChampionnatClassement />}
      {tournamentType === "elimination" && <AllerSimpleTableau />}
      {tournamentType === "elimination-aller-retour" && <AllerRetourTableau />}
    </ScrollView>
  );
};

export default ClassementTournament;
