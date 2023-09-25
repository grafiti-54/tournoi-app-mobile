import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMatch,
  toggleUserMatch,
  updateMatchLiveLocally,
  updateMatchScoreLocally,
  validateMatchScoreLocally,
} from "../../redux/features/matchSlice";
import moment from "moment";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";
import MatchDetail from "../MatchDetail";

//Composant d'affichages des matchs pour un tournoi avec des matchs à elimination aller-retour.
const AllerRetourEliminationMatchList = ({ tournoiId }) => {
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
        is_validated: match?.is_validated,
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
          team1: `Vainqueur de la double confrontation entre les équipes du match ${match1.index}`,
          team2: `Vainqueur de la double confrontation entre les équipes du match ${match2.index}`,
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

    // Supprimer le dernier tour si c'est un tour supplémentaire après la finale
    if (
      tourney[tourney.length - 1].length === 1 &&
      tourney[tourney.length - 2].length === 2
    ) {
      tourney.pop();
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

  //Mise a jour instantané du status en live du match avec socket io.
  useEffect(() => {
    const socket = io.connect(process.env.EXPO_PUBLIC_LOCAL_API_URL);
    socket.on("liveMatchUpdated", (data) => {
      dispatch(updateMatchLiveLocally(data));
    });

    socket.on("scoreUpdated", (data) => {
      // Mettez à jour le score du match localement
      dispatch(updateMatchScoreLocally(data));
    });

    socket.on("matchScoreValidated", (data) => {
      dispatch(
        validateMatchScoreLocally({
          matchId: data.match_id,
          dom_equipe_score: data.dom_equipe_score,
          ext_equipe_score: data.ext_equipe_score,
          is_validated: data.is_validated,
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  //Gestion ouverture/fermeture de la modal de détail du match.
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const openModal = (match) => {
    setModalVisible(true);
    setSelectedMatchId(match.id);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  //Gestion d'ajout/suppression d'un match en favoris
  const userMatchs = useSelector((state) => state.match.userMatchs);
  const toggleFavorite = (event, match) => {
    event.stopPropagation();
    //console.log("Toggle match avec ID:", match.match_id);
    dispatch(toggleUserMatch(match.id));
    //console.log("Matchs favoris actuels:", userMatchs); // Utilisez la variable userMatchs déjà définie
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <View style={styles.modalView}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <MatchDetail matchId={selectedMatchId} />
          </View>
        </TouchableOpacity>
      </Modal>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <>
          <View>
            {tournament?.map((round, roundIndex) => {
              const roundNumber = round.length /2;
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

                  {round?.map((match) => (
                    <View
                      onTouchEnd={() => openModal(match)}
                      key={match.index}
                      style={{
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "flex",
                        flexDirection: "row",
                        width: "98%",
                        justifyContent: "space-around",
                        marginVertical: 10,
                        backgroundColor: "#f0f8fd",
                        borderColor: "#a8ddfc",
                        padding: 6,
                        borderRadius: 35,
                        borderWidth: 1,
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
                          <View>
                            <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                              Match n°{match.index}
                            </Text>
                            <Text>
                              {match.is_validated
                                ? "Terminé"
                                : match.horaire !== "A définir" &&
                                  moment.utc(match.horaire).isValid()
                                ? moment.utc(match.horaire).format("HH:mm")
                                : "A définir"}
                            </Text>
                          </View>
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
                                style={{ width: 25, height: 25 }}
                              />
                            ) : null}

                            {/* Nom equipe dom */}
                            <View>
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontWeight:
                                    match.is_validated &&
                                    match.score1 > match.score2
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {match.team1}
                              </Text>
                            </View>
                          </View>

                          {/* Score dom */}
                          <Text
                            style={{
                              width: 40,
                              textAlign: "center",
                              marginRight: 10,
                            }}
                          >
                            {match.is_live || match.is_validated
                              ? match.score1
                              : moment.utc(match.horaire).isValid()
                              ? moment.utc(match.horaire).format("DD/MM")
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
                                style={{ width: 25, height: 25 }}
                              />
                            ) : null}

                            {/* Nom equipe ext */}
                            <View>
                              <Text
                                style={{
                                  marginLeft: 10,
                                  fontWeight:
                                    match.is_validated &&
                                    match.score2 > match.score1
                                      ? "bold"
                                      : "normal",
                                }}
                              >
                                {match.team2}
                              </Text>
                            </View>
                          </View>

                          {/* Score ext */}
                          <Text
                            style={{
                              width: 40,
                              textAlign: "center",
                              marginRight: 10,
                            }}
                          >
                            {match.is_live || match.is_validated
                              ? match.score2
                              : " "}
                          </Text>
                        </View>
                      </View>

                      {/* Ajout/suppression d'un match dans la liste des favoris de l'utilisateur */}
                      {match.id && (
                        <View
                          style={{ width: "10%" }}
                          onTouchEnd={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              marginLeft: 10,
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={(event) => toggleFavorite(event, match)}
                          >
                            <FontAwesome
                              name={
                                userMatchs?.includes(match.id)
                                  ? "star"
                                  : "star-o"
                              }
                              size={24}
                              color="#02a3fe"
                              style={{ marginTop: 22, marginRight: 15 }}
                            />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
          {/* Match pour la 3eme place */}
          {thirdPlaceMatch && (
            <View key={thirdPlaceMatch.index} style={{ marginVertical: 10 }}>
              {/* Container du 3EME TOUR du tournoi  */}
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
                  {ROUND_NAMES[0]}
                </Text>
              </View>
              {/* Container du match */}
              <View>
                <View
                  onTouchEnd={() => openModal(thirdPlaceMatch)}
                  key={thirdPlaceMatch.index}
                  style={{
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "flex",
                    flexDirection: "row",
                    width: "98%",
                    justifyContent: "space-around",
                    marginVertical: 10,
                    backgroundColor: "#f0f8fd",
                    borderColor: "#a8ddfc",
                    padding: 6,
                    borderRadius: 35,
                    borderWidth: 1,
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
                    {thirdPlaceMatch?.is_live ? (
                      <Text style={{ color: "red" }}>Live</Text>
                    ) : (
                      <Text>
                        {thirdPlaceMatch.horaire !== "A définir" &&
                        moment.utc(thirdPlaceMatch.horaire).isValid()
                          ? moment.utc(thirdPlaceMatch.horaire).format("HH:mm")
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
                      {/* Logo equipe domicile match 3eme place */}
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        {thirdPlaceMatch.logo1 ? (
                          <Image
                            source={{ uri: thirdPlaceMatch.logo1 }}
                            style={{ width: 25, height: 25 }}
                          />
                        ) : null}

                        {/* Nom equipe dom */}
                        <View>
                          <Text
                            style={{
                              marginLeft: 10,
                              fontWeight:
                                thirdPlaceMatch.is_validated &&
                                thirdPlaceMatch.score1 > thirdPlaceMatch.score2
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {thirdPlaceMatch.team1}
                          </Text>
                        </View>
                      </View>

                      {/* Score dom match 3eme place */}
                      <Text
                        style={{
                          width: 20,
                          textAlign: "center",
                          marginRight: 10,
                        }}
                      >
                        {thirdPlaceMatch.is_live || thirdPlaceMatch.is_validated
                          ? thirdPlaceMatch.score1
                          : "-"}
                      </Text>
                    </View>

                    {/* Container Extérieur  match 3eme place */}
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* Logo equipe ext match 3eme place */}
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        {thirdPlaceMatch.logo2 ? (
                          <Image
                            source={{ uri: thirdPlaceMatch.logo2 }}
                            style={{ width: 25, height: 25 }}
                          />
                        ) : null}

                        {/* Nom equipe ext match 3eme place */}
                        <View>
                          <Text
                            style={{
                              marginLeft: 10,
                              fontWeight:
                                thirdPlaceMatch.is_validated &&
                                thirdPlaceMatch.score2 > thirdPlaceMatch.score1
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {thirdPlaceMatch.team2}
                          </Text>
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
                        {thirdPlaceMatch.is_live || thirdPlaceMatch.is_validated
                          ? thirdPlaceMatch.score2
                          : "-"}
                      </Text>
                    </View>
                  </View>
                  {/* Ajout match 3eme place dans les favoris*/}
                  <View
                    style={{ width: "10%" }}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        marginLeft: 10,
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={(event) =>
                        toggleFavorite(event, thirdPlaceMatch)
                      }
                    >
                      <FontAwesome
                        name={
                          userMatchs?.includes(thirdPlaceMatch.id)
                            ? "star"
                            : "star-o"
                        }
                        size={24}
                        color="#02a3fe"
                        style={{ marginTop: 22, marginRight: 15 }}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

//Style pour la modal
const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Couleur de fond semi-transparente
  },
  modalView: {
    width: "90%",
    height: 300,
    backgroundColor: "white", // Changez la couleur de fond ici
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-end",
    backgroundColor: "#FF5B5B", // Couleur de fond du bouton
    borderRadius: 5, // Bord arrondi
    padding: 10, // Espacement interne
    marginBottom: 10,
  },
  closeButtonText: {
    color: "white", // Couleur du texte du bouton
  },
});

export default AllerRetourEliminationMatchList;
