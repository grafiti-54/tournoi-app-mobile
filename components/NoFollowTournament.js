import React from "react";
import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

//Composant d'affichage utilisé lorsqu'un utilisateur n'as pas de tournoi suivi.
const NoFollowTournament = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10%",
      }}
    >
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FontAwesome name="info-circle" size={30} color="#02a3fe" />
        <Text style={{ fontWeight: "bold", fontSize: 35 }}>Information </Text>
        <Text style={{ fontWeight: "bold", fontSize: 45, color: "#02a3fe" }}>
          TOURNOI-APP
        </Text>
      </View>
      <Text style={{ marginTop: 20, fontSize: 16, marginRight:"5%", marginLeft:"5%" }}>
        Vous n'avez pas commencé à suivre un tournoi. Veuillez scanner un QR
        code ou rechercher un tournoi public.
      </Text>
    </View>
  );
};

export default NoFollowTournament;
