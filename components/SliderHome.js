import React from "react";
import { Pressable, ScrollView, Text } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const SliderHome = () => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {/* Card 1 slider */}
      <Pressable
        style={{
          width: 200,
          height: 150,
          marginTop: 10,
          backgroundColor: "#ccedff",
          borderRadius: 10,
          padding: 20,
          marginHorizontal: 20,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <AntDesign name="qrcode" size={50} color="black" />
        <Text style={{ color: "black", fontSize: 15, fontWeight: "500" }}>
          Scannez le QR code du tournoi que vous souhaitez suivre.
        </Text>
      </Pressable>
      {/* Card 2 slider */}
      <Pressable
        style={{
          width: 200,
          height: 150,
          marginTop: 10,
          backgroundColor: "white",
          borderColor: "#E0E0E0",
          borderWidth: 2,
          borderRadius: 10,
          padding: 20,
          marginHorizontal: 20,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons name="tournament" size={50} color="black" />
        <Text style={{ color: "black", fontSize: 15, fontWeight: "500" }}>
          Suivez les scores du tournoi en temps réel via l'application.
        </Text>
      </Pressable>

      {/* Card 3 slider */}
      <Pressable
        style={{
          width: 200,
          height: 150,
          marginTop: 10,
          backgroundColor: "#ceced0",
          borderRadius: 10,
          padding: 20,
          marginHorizontal: 20,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <MaterialIcons name="favorite-outline" size={50} color="black" />
        <Text style={{ color: "black", fontSize: 15, fontWeight: "500" }}>
          Retrouvez et gerez la liste de vos tournois favoris
        </Text>
      </Pressable>
    </ScrollView>
  );
};

export default SliderHome;
