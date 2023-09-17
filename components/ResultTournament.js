import React, { useEffect } from "react";
import { ScrollView } from "react-native";
import AllerRetourEliminationMatchList from "./MatchList/AllerRetourEliminationMatchList";
import DirectEliminationMatchList from "./MatchList/DirectEliminationMatchList";
import ChampionnatMatchList from "./MatchList/ChampionnatMatchList";
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllMatch } from "../redux/features/matchSlice";

const ResultTournament = ({ currentTournamentId, tournamentType }) => {
  //Récupérer le format de tournoi
  // console.log(
  //   "id du tournoi : ",
  //   currentTournamentId,
  //   "type de tournoi récupéré : ",
  //   tournamentType
  // );

  const dispatch = useDispatch();

  const matchsList = useSelector((state) => state.match.data);
  useEffect(() => {
    dispatch(fetchAllMatch(currentTournamentId));
  }, [currentTournamentId, dispatch]);

  //console.log(matchsList);  

  //Afficher les composants selon le type de championnat récupéré.
  return (
    <ScrollView>
      {tournamentType === "championnat" && <ChampionnatMatchList matchs={matchsList} />}
      {tournamentType === "elimination" && <DirectEliminationMatchList tournoiId={currentTournamentId} />}
      {tournamentType === "elimination-aller-retour" && (
        <AllerRetourEliminationMatchList tournoiId={currentTournamentId} />
      )}
    </ScrollView>
  );
};

export default ResultTournament;
