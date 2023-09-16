import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";

//Composant d'affichages des matchs pour un tournoi avec des matchs de championnat.
const ChampionnatMatchList = ({ matchs }) => {
  //console.log(matchs);

  // Regroupez les matchs par journée (round)
  const matchsByRound = matchs.reduce((acc, match) => {
    (acc[match.round] = acc[match.round] || []).push(match);
    return acc;
  }, {});
  return (
    <View>
      <Text>Affichage des matchs pour un tournoi de type championnat</Text>
      <>
        {Object.entries(matchsByRound).map(([round, matchesForRound]) => (
          <View key={round} style={{ marginVertical: 10 }}>
            <View style={{backgroundColor:"#ccedff", width:"60%", marginTop:15, padding:5}}>
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
  <View key={match.match_id} style={{ marginVertical: 5, marginHorizontal: 15 }}>
    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      
      {/* Date ou live du match */}
      <View style={{ width: 50, alignItems: "center" }}>
        {match?.is_live ? (
          <Text style={{ color: "red" }}>Live</Text>
        ) : (
          <Text>{moment.utc(match.horaire).format("HH:mm")}</Text>
        )}
      </View>
      
      {/* Logo domicile */}
      <Image source={{ uri: match.Domicile.logopath }} style={{ width: 20, height: 20 }} />
      
      {/* Nom equipe dom */}
      <View style={{ flex: 1, alignItems: "flex-start" }}>
        <Text>{match.Domicile.name}</Text>
      </View>
      
      {/* Score dom */}
      <Text style={{ width: 20, textAlign: "center" }}>
        {match.is_live || match.is_validated ? match.dom_equipe_score : " "}
      </Text>
      
      {/* Séparateur score dom ext */}
      <Text>-</Text>
      
      {/* Score ext */}
      <Text style={{ width: 20, textAlign: "center" }}>
        {match.is_live || match.is_validated ? match.ext_equipe_score : " "}
      </Text>
      
      {/* Nom equipe ext */}
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text>{match.Exterieur.name}</Text>
      </View>
      
      {/* Logo equipe exterieur */}
      <Image source={{ uri: match.Exterieur.logopath }} style={{ width: 20, height: 20 }} />
      
      {/* Détail du match */}
      <TouchableOpacity style={{ marginLeft: 10 }}>
        <Text>Info</Text>
        {/* <Image source={{ uri: "URL_DE_VOTRE_ICONE" }} style={{ width: 30, height: 30 }} /> */}
      </TouchableOpacity>
    </View>
  </View>
))}

          </View>
        ))}
      </>
    </View>
  );
};

export default ChampionnatMatchList;
