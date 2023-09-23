import React from "react";
import { Text, View, Image, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllStanding } from "../../redux/features/classementSlice";
import { useEffect } from "react";

const ChampionnatClassement = ({ group, groupId, tournoiId }) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.classement.data);

  useEffect(() => {
    dispatch(fetchAllStanding(tournoiId));
  }, [tournoiId, dispatch]);

  return (
    <View style={{ marginBottom: 20 }}>
      <View
        style={{
          backgroundColor: "#ccedff",
          width: "60%",
          marginVertical: 15,
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
          Groupe {groupId}
        </Text>
      </View>

      <ScrollView horizontal={true}>
        <View>
          {/* Entêtes du tableau */}
          <View
            style={{
              flexDirection: "row",
              borderBottomWidth: 1,
              borderBottomColor: "#888",
            }}
          >
            {[
              "#",
              "",
              "Équipe",
              "Pts",
              "MJ",
              "V",
              "N",
              "D",
              "BP",
              "BC",
              "Diff",
            ].map((header, index) => (
              <Text
                key={index}
                style={{
                  width: header === "Équipe" ? 140 : 40,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                {header}
              </Text>
            ))}
          </View>

          {/* Corps du tableau */}
          {group?.map((team, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: 0.5, // Ligne légèrement plus épaisse
                borderBottomColor: "#888", // Ligne plus foncée
                minHeight: 45, // Hauteur plus grande
                backgroundColor:
                  index === 0
                    ? "#d4ffd6"
                    : index === group.length - 1
                    ? "#ffd4d4"
                    : index % 2 === 0
                    ? "#e1f2fc"
                    : "white",
              }}
            >
              <Text style={{ width: 40, textAlign: "center" }}>
                {index + 1}
              </Text>
              <View style={{ width: 40, alignItems: "center" }}>
                <Image
                  source={{ uri: team.logopath }}
                  style={{ width: 40, height: 30, resizeMode: "contain" }}
                />
              </View>
              <Text style={{ width: 140 }}>{team.name}</Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.points}
              </Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.matchesPlayed}
              </Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.wins}
              </Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.draws}
              </Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.losses}
              </Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.goalsScored}
              </Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.goalsAgainst}
              </Text>
              <Text style={{ width: 40, textAlign: "center" }}>
                {team.goalsDifference}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ChampionnatClassement;
