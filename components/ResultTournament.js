import React from "react";
import { ScrollView } from "react-native";
import AllerRetourEliminationMatchList from "./MatchList/AllerRetourEliminationMatchList";
import DirectEliminationMatchList from "./MatchList/DirectEliminationMatchList";
import ChampionnatMatchList from "./MatchList/ChampionnatMatchList";

const ResultTournament = ({ currentTournamentId, tournamentType }) => {
  //Récupérer le format de tournoi
  // console.log(
  //   "id du tournoi : ",
  //   currentTournamentId,
  //   "type de tournoi récupéré : ",
  //   tournamentType
  // );
  //Afficher les composants selon le type de championnat récupéré.
  return (
    <ScrollView>
      {tournamentType === "championnat" && <ChampionnatMatchList />}
      {tournamentType === "elimination" && <DirectEliminationMatchList />}
      {tournamentType === "elimination-aller-retour" && (
        <AllerRetourEliminationMatchList />
      )}
    </ScrollView>
  );
};

export default ResultTournament;
