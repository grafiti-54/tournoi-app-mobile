import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMatch,
  updateMatchLiveLocally,
  updateMatchScoreLocally,
  validateMatchScoreLocally,
} from "../../redux/features/matchSlice";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";
import MatchDetail from "../MatchDetail";
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
      ? matchsList.reduce((acc, match) => {
          (acc[match.round] = acc[match.round] || []).push(match);
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
  const [selectedMatch, setSelectedMatch] = useState(null);
  const openModal = (match) => {
    setModalVisible(true);
    setSelectedMatch(match);
  };

  const closeModal = () => {
    setModalVisible(false);
    //setSelectedMatch(null);
  };

  //Gestion d'ajout/suppression d'un match en favoris
  const toggleFavorite = (event, match) => {
    event.stopPropagation(); // Cela empêche la propagation de l'événement au composant parent
    console.log("test");
    // Ici, ajoutez ou supprimez le match de la liste des favoris
    // ... votre logique pour gérer les favoris
  };

  return (
    <View style={{ flex: 1 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              width: "90%",
              height: 300,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
            }}
          >
            <TouchableOpacity
              onPress={closeModal}
              style={{ alignSelf: "flex-end" }}
            >
              <Text>Fermer</Text>
            </TouchableOpacity>
            <MatchDetail match={selectedMatch} />
          </View>
        </View>
      </Modal>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#02A3FE" />
        </View>
      ) : (
        <>
          {Object.entries(matchsByRound).map(([round, matchesForRound]) => (
            <View key={round} style={{ marginVertical: 10 }}>
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
                  Journée {round}
                </Text>
              </View>
              {matchesForRound?.map((match, index) => (
                <View
                  onTouchEnd={() => openModal(match)}
                  key={index}
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

                  {/* Détail du match */}
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
                      {/* <FontAwesome name="star" size={24} color="#02a3fe" /> */}
                      <FontAwesome
                        style={{ marginTop: 25, marginRight: 15 }}
                        name="star-o"
                        size={24}
                        color="#02a3fe"
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

export default ChampionnatMatchList;
