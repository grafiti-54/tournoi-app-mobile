import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMatch } from "../../redux/features/matchSlice";
//import blank from "../../assets/image/transparentPicture.png";
import moment from "moment";

//Composant d'affichages des matchs pour un tournoi avec des matchs à elimination direct.
const DirectEliminationMatchList = ({ tournoiId }) => {
  const [tournament, setTournament] = useState([]);
  const data = useSelector((state) => state.match.data);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.match.loading);

  // Fonction pour adapter les données du serveur dans un format lisible
  const adaptServerData = (serverData) => {
    return serverData.map((match, index) => {
      return {
        index: index + 1,
        id: match?.match_id,
        logo1: match?.Domicile.logopath,
        logo2: match?.Exterieur.logopath,
        team1: match?.Domicile.name,
        team2: match?.Exterieur.name,
        score1: match?.dom_equipe_score,
        score2: match?.ext_equipe_score,
        round: match?.round,
        is_live: match?.is_live,
        horaire: match?.horaire,
        is_validated: match.is_validated,
      };
    });
  };

  // Fonction pour générer la structure du tournoi à partir des données des matchs
  const generateTournament = (matches) => {
    let tourney = [];
    let minRound = Math.min(...matches.map((match) => match.round));
    let maxRound = Math.max(...matches.map((match) => match.round));

    // Générer tous les matchs joués
    for (let i = minRound; i <= maxRound; i++) {
      let round = matches.filter((match) => match.round === i);
      tourney.push(round);
    }

    // Générer les matchs provisoires pour le reste du tournoi
    let nextMatchIndex = matches.length + 1;
    while (tourney[tourney.length - 1].length > 1) {
      let lastRound = tourney[tourney.length - 1];
      let nextRound = [];
      for (let i = 0; i < lastRound.length; i += 2) {
        let match1 = lastRound[i];
        let match2 = lastRound[i + 1];
        let provisionalMatch = {
          index: nextMatchIndex,
          name: `Vainqueur du match ${match1.id} vs Vainqueur du match ${match2.id}`,
          // logo1: blank, //logo equipe a domicile
          // logo2: blank, //logo equipe à l'extérieur
          team1: `Vainqueur du match ${match1.index}`,
          team2: `Vainqueur du match ${match2.index}`,
          score1: " ", //score domicile
          score2: " ", //score extérieur
          round: maxRound + 1,
          is_live: "",
          horaire: "A définir",
          is_validated: " ",
        };
        nextMatchIndex++;
        nextRound.push(provisionalMatch);
      }
      tourney.push(nextRound);
      maxRound++;
    }
    return tourney;
  };

  // Récupérer les données des matchs lorsque 'tournoiId' change
  useEffect(() => {
    dispatch(fetchAllMatch(tournoiId));
  }, [tournoiId, dispatch]);

  // Mise à jour de l'état du tournoi lorsque les données ('data') changent
  useEffect(() => {
    if (data.length) {
      const adaptedTeams = adaptServerData(data);
      let tournament = generateTournament(adaptedTeams);
      setTournament(tournament);
    }
  }, [data]);

  // Correspondance entre les nombres de tours et leur nom d'affichage
  const ROUND_NAMES = {
    128: "128ème de finale",
    64: "64ème de finale",
    32: "32ème de finale",
    16: "16ème de finale",
    8: "8ème de finale",
    4: "1/4 de finale",
    2: "Demi-finale",
    1: "Finale",
    0: "3eme place",
  };

  //Récupération du match pour la 3eme place.
  const [thirdPlaceMatch, setThirdPlaceMatch] = useState(null);

  useEffect(() => {
    if (data.length) {
      const thirdPlace = data.find((match) => match.round === 0);
      if (thirdPlace) {
        setThirdPlaceMatch(adaptServerData([thirdPlace])[0]);
      }
      const adaptedTeams = adaptServerData(
        data.filter((match) => match.round !== 0)
      );
      let tournament = generateTournament(adaptedTeams);
      setTournament(tournament);
    }
  }, [data]);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View>
            {tournament.map((round, roundIndex) => {
              const roundNumber = round.length;
              return (
                <View key={roundIndex} style={{ marginVertical: 10 }}>
                  {/* Container du tour du tournoi  */}
                  <View
                    style={{
                      backgroundColor: "#ccedff",
                      width: "60%",
                      marginTop: 15,
                      padding: 5,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontWeight: "bold",
                        fontSize: 18,
                      }}
                    >
                      {ROUND_NAMES[roundNumber] || `Tour ${roundIndex + 1}`}
                    </Text>
                  </View>
                  {/* Container d'un match */}
                  <View style={{ marginVertical: 5, marginHorizontal: 15 }}>
                    {round?.map((match) => (
                      <View
                        key={match.index}
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          width: "100%",
                          justifyContent: "space-around",
                          marginVertical: 10,
                        }}
                      >
                        {/* Date ou live du match */}
                        <View
                          style={{
                            width: "15%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {match?.is_live ? (
                            <Text style={{ color: "red" }}>Live</Text>
                          ) : (
                            <Text>
                              {match.horaire !== "A définir" &&
                              moment.utc(match.horaire).isValid()
                                ? moment.utc(match.horaire).format("HH:mm")
                                : "A définir"}
                            </Text>
                          )}
                        </View>
                        {/* Container des 2 équipes */}
                        <View style={{ width: "70%", marginLeft: 8 }}>
                          {/* Container domicile */}
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginVertical: 8,
                            }}
                          >
                            {/* Logo equipe domicile */}
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              {match.logo1 ? (
                                <Image
                                  source={{ uri: match.logo1 }}
                                  style={{ width: 20, height: 20 }}
                                />
                              ) : null}

                              {/* Nom equipe dom */}
                              <View>
                                <Text>{match.team1}</Text>
                              </View>
                            </View>

                            {/* Score dom */}
                            <Text
                              style={{
                                width: 20,
                                textAlign: "center",
                                marginRight: 10,
                              }}
                            >
                              {match.is_live || match.is_validated
                                ? match.score1
                                : "-"}
                            </Text>
                          </View>

                          {/* Container Extérieur */}
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            {/* Logo equipe ext */}
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              {match.logo2 ? (
                                <Image
                                  source={{ uri: match.logo2 }}
                                  style={{ width: 20, height: 20 }}
                                />
                              ) : null}

                              {/* Nom equipe ext */}
                              <View>
                                <Text>{match.team2}</Text>
                              </View>
                            </View>

                            {/* Score ext */}
                            <Text
                              style={{
                                width: 20,
                                textAlign: "center",
                                marginRight: 10,
                              }}
                            >
                              {match.is_live || match.is_validated
                                ? match.score2
                                : "-"}
                            </Text>
                          </View>
                        </View>

                        {/* Détail du match */}
                        <TouchableOpacity
                          style={{
                            marginLeft: 10,
                            width: "10%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <View>
                            <Text>Info</Text>
                          </View>
                          {/* <Image source={{ uri: "URL_DE_VOTRE_ICONE" }} style={{ width: 30, height: 30 }} /> */}
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

export default DirectEliminationMatchList;
