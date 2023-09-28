import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AppState,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  clearUserMatchs,
  fetchAllMatch,
  toggleUserMatch,
  updateMatchLiveLocally,
  updateMatchScoreLocally,
  validateMatchScoreLocally,
} from "../redux/features/matchSlice";
import { useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";
import MatchDetail from "./MatchDetail";
import NoFollowMatch from "./NoFollowMatch";
import moment from "moment";
import { GlobalStyle } from "./styles/GlobalStyle";
import registerForPushNotificationsAsync from "../services/notificationService";
import { handleUserNotification } from "../redux/features/notificationSlice";
import * as Notifications from 'expo-notifications';


//Composant qui regroupe la liste des matchs suivi (favoris) de l'utilisateur.
const UserMatchList = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Récupérer la liste des matchs et des matchs favoris depuis le state Redux
  const allMatchs = useSelector((state) => state.match.data);
  const userMatchsIds = useSelector((state) => state.match.userMatchs);

  // Filtrer les matchs pour obtenir seulement les matchs favoris
  const userMatchs = allMatchs
    .filter((match) => match) // exclure les éléments null
    .filter((match) => userMatchsIds?.includes(match.match_id)); // assurez-vous que match_id est une chaîne
  //console.log("Matchs favoris:", userMatchs);
  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchAllMatch()); // Assurez-vous de passer l'ID du tournoi si nécessaire
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  //Supression de tous les matchs de la liste des favoris.
  const handleClearUserMatchs = () => {
    Alert.alert(
      "Confirmation",
      "Êtes-vous sûr de vouloir supprimer tous les matchs suivis ?",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Oui, supprimer",
          onPress: () => dispatch(clearUserMatchs()),
        },
      ]
    );
  };

  //Notification
  async function showLocalNotification(title, body) {
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: null, // cela signifie que la notification sera affichée immédiatement
    });
    return identifier;
  }
  
  //Mise a jour instantané du status en live du match avec socket io.
  useEffect(() => {
    const socket = io.connect(process.env.EXPO_PUBLIC_LOCAL_API_URL);
    //console.log("Socket Connected:", socket.connected);
    socket.on("liveMatchUpdated", (data) => {
      dispatch(updateMatchLiveLocally(data));
    });
    socket.on("scoreUpdated", (data) => {
      //console.log("Score Updated:", data);
      //console.log("Score Updated Event Received:", data);
      // Mettez à jour le score du match localement
      dispatch(updateMatchScoreLocally(data));
      //console.log("data recu pour la notifiction ", data);
      if (userMatchsIds?.includes(data.matchId)) {
        // Si l'application n'est pas active, envoyez la notification
        // if (AppState.currentState !== "active") {
          showLocalNotification("TOURNOI-APP", data.message);
        //}
      }
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
  }, [dispatch, userMatchsIds]);

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
  const toggleFavorite = async (event, match) => {
    event.stopPropagation();
    const token = await registerForPushNotificationsAsync();
    //console.log("token:", JSON.stringify(token));
    const tokenValue = token.data;
    // Dispatch l'action pour s'abonner aux notifications
    dispatch(
      handleUserNotification({ matchId: match.match_id, token: tokenValue })
    );
    dispatch(toggleUserMatch(match.match_id));
  };

  return (
    <View style={{ flex: 1 }}>
      {loading && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
      {userMatchs?.length === 0 ? (
        <View style={{ marginTop: "33%" }}>
          <NoFollowMatch />
        </View>
      ) : (
        <>
          <View
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 26,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 35 }}>
              Mes matchs suivis{" "}
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 45, color: "#02a3fe" }}
            >
              TOURNOI-APP
            </Text>
          </View>
          {userMatchs.map((match, index) => (
            <View
              onTouchEnd={() => openModal(match)}
              key={index}
              style={[GlobalStyle.shadow, GlobalStyle.matchContainer]}
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
                  {/* "star" : "star-o" */}
                  <FontAwesome
                    name="star"
                    size={24}
                    color="#02a3fe"
                    style={{ marginTop: 22, marginRight: 15 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </>
      )}
      {/* {userMatchs?.length === 0 ? (
        <Text></Text>
      ) : (
        <View
          style={{
            width: "80%",
            marginRight: "auto",
            marginLeft: "auto",
            marginVertical: 35,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "red", // ou une autre couleur
              padding: 20, // ajoutez le padding ici
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 50,
            }}
            onPress={handleClearUserMatchs}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Supprimer tous les matchs suivis
            </Text>
          </TouchableOpacity>
        </View>
      )} */}
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

export default UserMatchList;
