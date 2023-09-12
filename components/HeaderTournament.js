import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HeaderTournament = () => {
  return (
    // Container header
    <View
      style={{
        backgroundColor: "#003580",
        height: 65,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {/*  Info tournoi ( résumé ) */}
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderColor: "white",
          borderWidth: 1,
          borderRadius: 25,
          padding: 8,
        }}
      >
        <Ionicons name="information-circle-sharp" size={24} color="white" />
        <Text
          style={{
            marginLeft: 8,
            fontWeight: "bold",
            color: "white",
            fontSize: 15,
          }}
        >
          Informations
        </Text>
      </Pressable>

      {/*  Résultats match du tournoi */}
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="scoreboard-outline"
          size={26}
          color="white"
        />
        <Text
          style={{
            marginLeft: 8,
            fontWeight: "bold",
            color: "white",
            fontSize: 15,
          }}
        >
          Résultats
        </Text>
      </Pressable>

      {/*  Classement du tournoi */}
      <Pressable
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <FontAwesome5 name="table" size={26} color="white" />
        <Text
          style={{
            marginLeft: 8,
            fontWeight: "bold",
            color: "white",
            fontSize: 15,
          }}
        >
          Classement
        </Text>
      </Pressable>
    </View>
  );
};

export default HeaderTournament;
