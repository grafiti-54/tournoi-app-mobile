import React from "react";
import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

const NoFollowMatch = () => {
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
      <Text
        style={{
          marginTop: 20,
          fontSize: 16,
          marginRight: "5%",
          marginLeft: "5%",
        }}
      >
        Vous n'avez pas commencé à suivre de matchs favoris pour ce tournoi. Pour suivre un match,
        appuyez sur l'étoile dans la liste des matchs du tournoi. Vous serez
        averti lorsque le match commencera.
      </Text>
    </View>
  );
};

export default NoFollowMatch;
