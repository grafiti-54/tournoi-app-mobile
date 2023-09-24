import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";


//Composant de navigation pour la page des favoris.
const HeaderFavoris = ({ setSelectedComponent }) => {
  const [activeTab, setActiveTab] = useState("Tournois");
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
        {/*  Tournois favoris */}
        <Pressable
          onPress={() => {
            setSelectedComponent("Tournois");
            setActiveTab("Tournois");
          }}
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 25,
              padding: 8,
            },
            activeTab === "Tournois"
              ? {
                  borderColor: "#02a3fe",
                  borderWidth: 1,
                  backgroundColor: "#02a3fe",
                }
              : {},
          ]}
        >
          <MaterialCommunityIcons
            name="tournament"
            size={26}
            color={activeTab === "Tournois" ? "white" : "black"}
          />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "bold",
              color: "white",
              fontSize: 15,
              color: activeTab === "Tournois" ? "white" : "black",
            }}
          >
            Tournoi
          </Text>
        </Pressable>

        {/*  Matchs favoris */}
        <Pressable
          onPress={() => {
            setSelectedComponent("Matchs");
            setActiveTab("Matchs");
          }}
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              borderRadius: 25,
              padding: 8,
            },
            activeTab === "Matchs"
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
            color={activeTab === "Matchs" ? "white" : "black"}
          />
          <Text
            style={{
              marginLeft: 8,
              fontWeight: "bold",
              color: activeTab === "Matchs" ? "white" : "black",
              fontSize: 15,
            }}
          >
            Matchs
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

export default HeaderFavoris;
