import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMatch } from "../../redux/features/matchSlice";

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

  return (
    <View style={{ flex: 1 }}>
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
              {matchesForRound?.map((match) => (
                <View
                  key={match.index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-around",
                    marginVertical: 10,
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
                        {match.horaire !== "A définir" &&
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
                            style={{ width: 20, height: 20 }}
                          />
                        ) : null}

                        {/* Nom equipe dom */}
                        <View>
                          <Text>{match.Domicile.name}</Text>
                        </View>
                      </View>

                      {/* Score dom */}
                      <Text
                        style={{
                          width: 20,
                          textAlign: "center",
                          marginRight: 10,
                        }}
                      >
                        {match.is_live || match.is_validated
                          ? match.dom_equipe_score
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
                          <Image
                            source={{ uri: match.Exterieur.logopath }}
                            style={{ width: 20, height: 20 }}
                          />
                        ) : null}

                        {/* Nom equipe ext */}
                        <View>
                          <Text>{match.Exterieur.name}</Text>
                        </View>
                      </View>

                      {/* Score ext */}
                      <Text
                        style={{
                          width: 20,
                          textAlign: "center",
                          marginRight: 10,
                        }}
                      >
                        {match.is_live || match.is_validated
                          ? match.ext_equipe_score
                          : "-"}
                      </Text>
                    </View>
                  </View>

                  {/* Détail du match */}
                  <TouchableOpacity
                    style={{
                      marginLeft: 10,
                      width: "10%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text>Info</Text>
                    </View>
                    {/* <Image source={{ uri: "URL_DE_VOTRE_ICONE" }} style={{ width: 30, height: 30 }} /> */}
                  </TouchableOpacity>
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
