import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//
const HeaderTournament = ({ setSelectedComponent }) => {
  const [activeTab, setActiveTab] = useState("Informations");
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
        onPress={() => {
          setSelectedComponent("Informations");
          setActiveTab("Informations");
        }}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 25,
            padding: 8,
          },
          activeTab === "Informations"
            ? {
                borderColor: "white",
                borderWidth: 1,
              }
            : {},
        ]}
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
        onPress={() => {
          setSelectedComponent("Résultats");
          setActiveTab("Résultats");
        }}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 25,
            padding: 8,
          },
          activeTab === "Résultats"
            ? {
                borderColor: "white",
                borderWidth: 1,
              }
            : {},
        ]}
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
        onPress={() => {
          setSelectedComponent("Classement");
          setActiveTab("Classement");
        }}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 25,
            padding: 8,
          },
          activeTab === "Classement"
            ? {
                borderColor: "white",
                borderWidth: 1,
              }
            : {},
        ]}
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
