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
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMatch,
  toggleUserMatch,
  updateMatchLiveLocally,
  updateMatchScoreLocally,
  validateMatchScoreLocally,
} from "../../redux/features/matchSlice";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";
import MatchDetail from "../MatchDetail";
import { GlobalStyle } from "../styles/GlobalStyle";
//const serverAddress = process.env.EXPO_PUBLIC_LOCAL_API_URL;

//Composant d'affichages des matchs pour un tournoi avec des matchs de championnat.
const ChampionnatMatchList = () => {
  //console.log(matchs);
  const dispatch = useDispatch();
  const currentTournamentId = useSelector(
    (state) => state.tournoi.currentTournamentId
  );
  const matchsList = useSelector((state) => state.match.data);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllMatch(currentTournamentId));
      setLoading(false);
    };

    fetchData();
  }, [currentTournamentId, dispatch]);

  // Regroupez les matchs par journée (round)
  const matchsByRound =
    matchsList && Array.isArray(matchsList)
      ? matchsList?.reduce((acc, match) => {
          (acc[match?.round] = acc[match?.round] || []).push(match);
          return acc;
        }, {})
      : {};

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
    setSelectedMatchId(match.match_id);
  };

  const closeModal = () => {
    setModalVisible(false);
    //setSelectedMatch(null);
  };

  //Gestion d'ajout/suppression d'un match en favoris
  const userMatchs = useSelector((state) => state.match.userMatchs);
  const toggleFavorite = (event, match) => {
    event.stopPropagation();
    //console.log("Toggle match avec ID:", match.match_id);
    dispatch(toggleUserMatch(match.match_id));
    //console.log("Matchs favoris actuels:", userMatchs); // Utilisez la variable userMatchs déjà définie
  };
  // useEffect(() => {
  //   console.log(" ");
  // }, [userMatchs]);

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
          <ActivityIndicator size="large" color="#02A3FE" />
        </View>
      ) : (
        <>
          {Object.entries(matchsByRound)?.map(([round, matchesForRound]) => (
            <View key={round} style={{ marginVertical: 10 }}>
              <View
                style={[
                  GlobalStyle.shadow,
                  {
                    backgroundColor: "#ccedff",
                    width: "60%",
                    marginTop: 15,
                    padding: 5,
                  },
                ]}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  Journée {round}
                </Text>
              </View>
              {matchesForRound?.map((match, index) => (
                <View
                  onTouchEnd={() => openModal(match)}
                  key={index}
                  style={[
                    GlobalStyle.shadow,
                    GlobalStyle.matchContainer,
                  ]}
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
                        {match.is_validated
                          ? "Terminé"
                          : match.horaire !== "A définir" &&
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
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        {match.Domicile.logopath ? (
                          <Image
                            source={{ uri: match.Domicile.logopath }}
                            style={{
                              width: 25,
                              height: 25,
                              resizeMode: "contain",
                            }}
                          />
                        ) : null}

                        {/* Nom equipe dom */}
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              marginLeft: 10,
                              fontWeight:
                                match.is_validated &&
                                match.dom_equipe_score > match.ext_equipe_score
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {match.Domicile.name}
                          </Text>
                        </View>
                      </View>

                      {/* Score dom */}
                      <Text
                        style={{
                          fontSize: 16,
                          width: 45,
                          textAlign: "center",
                          marginRight: 10,
                        }}
                      >
                        {match.is_live || match.is_validated
                          ? match.dom_equipe_score
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
                      <View style={{ display: "flex", flexDirection: "row" }}>
                        {match.Exterieur.logopath ? (
                          <View
                            style={{
                              width: 25,
                              height: 25,
                              marginBottom: 15,
                            }}
                          >
                            <Image
                              source={{ uri: match.Exterieur.logopath }}
                              style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: "contain",
                              }}
                            />
                          </View>
                        ) : null}

                        {/* Nom equipe ext */}
                        <View>
                          <Text
                            style={{
                              fontSize: 16,
                              marginLeft: 10,
                              fontWeight:
                                match.is_validated &&
                                match.ext_equipe_score > match.dom_equipe_score
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {match.Exterieur.name}
                          </Text>
                        </View>
                      </View>

                      {/* Score ext */}
                      <Text
                        style={{
                          fontSize: 16,
                          width: 45,
                          textAlign: "center",
                          marginRight: 10,
                        }}
                      >
                        {match.is_live || match.is_validated
                          ? match.ext_equipe_score
                          : ""}
                      </Text>
                    </View>
                  </View>

                  {/* Ajout/suppression d'un match dans la liste des favoris de l'utilisateur */}
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
                          userMatchs?.includes(match.match_id)
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
              ))}
            </View>
          ))}
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

export default ChampionnatMatchList;
