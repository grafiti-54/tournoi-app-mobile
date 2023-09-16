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
    <>
      <View
        style={{
          backgroundColor: "white",
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
                  borderColor: "#02a3fe",
                  borderWidth: 1,
                  backgroundColor: "#02a3fe",
                }
              : {},
          ]}
        >
          <Ionicons
            name="information-circle-sharp"
            size={24}
            color={activeTab === "Informations" ? "white" : "black"}
          />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "bold",
              color: "white",
              fontSize: 15,
              color: activeTab === "Informations" ? "white" : "black",
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
                  borderColor: "#02a3fe",
                  borderWidth: 1,
                  backgroundColor: "#02a3fe",
                }
              : {},
          ]}
        >
          <MaterialCommunityIcons
            name="scoreboard-outline"
            size={26}
            //color="black"
            color={activeTab === "Résultats" ? "white" : "black"}
          />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "bold",
              color: activeTab === "Résultats" ? "white" : "black",
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
                  borderColor: "#02a3fe",
                  borderWidth: 1,
                  backgroundColor: "#02a3fe",
                }
              : {},
          ]}
        >
          <FontAwesome5
            name="table"
            size={26}
            color={activeTab === "Classement" ? "white" : "black"}
          />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "bold",
              color: "white",
              fontSize: 15,
              color: activeTab === "Classement" ? "white" : "black",
            }}
          >
            Classement
          </Text>
        </Pressable>
      </View>
      <View
        style={{
          height: 1,
          width: "70%",
          backgroundColor: "lightgray",
          alignSelf: "center",
          marginVertical: 8,
        }}
      />
    </>
  );
};

export default HeaderTournament;
