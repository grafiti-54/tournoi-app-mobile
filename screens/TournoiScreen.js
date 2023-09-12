import { Text, View, Animated, ScrollView } from "react-native";
import React, { useLayoutEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import SeacrhMenu from "../components/SeacrhMenu";
import HeaderTournament from "../components/HeaderTournament";
import { useSelector } from "react-redux";
import InformationTournament from "../components/InformationTournament";
import ResultTournament from "../components/ResultTournament";
import ClassementTournament from "../components/ClassementTournament";

//Screen détails du tournoi divisé en 3 partie ( info, matchs , classements)
const TournoiScreen = () => {
  const currentTournamentId = useSelector(
    (state) => state.tournoi.currentTournamentId
  );
  const navigation = useNavigation();
  const [seacrhMenuVisible, setSeacrhMenuVisible] = useState(false);
  const scrollRef = useRef();

  const [selectedComponent, setSelectedComponent] = useState("Informations");

  //console.log("id récupéré lors de la navigation", currentTournamentId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View>
          <Text
            style={{
              fontSize: 25,
              fontFamily: "Poppins",
              fontWeight: "400",
              color: "#02A3FE",
              fontWeight: "bold",
              marginBottom: "20px",
            }}
          >
            TOURNOI-APP
          </Text>
        </View>
      ),
      headerStyle: {
        backgroundColor: "#090915",
        height: 90,
        borderBottomColor: "transparent", // supprime la séparation de l'élément.
        shadowColor: "transparent", // supprime la séparation de l'élément.
      },
      //Buton Loupe pour la recherche des tournois.
      headerRight: () => (
        <FontAwesome
          name="search"
          size={24}
          color="white"
          style={{ marginRight: 12 }}
          //Affiche/cache le sous menu de recherche lors du clic sur la loupe.
          onPress={() => {
            setSeacrhMenuVisible(!seacrhMenuVisible);
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
            }
          }}
        />
      ),
    });
  }, [seacrhMenuVisible]);

  return (
    <Animated.ScrollView style={{ flex: 1 }} ref={scrollRef}>
      {seacrhMenuVisible && <SeacrhMenu />}
      <HeaderTournament setSelectedComponent={setSelectedComponent} />
      <ScrollView>
        {selectedComponent === "Informations" && (
          <InformationTournament currentTournamentId={currentTournamentId} />
        )}
        {selectedComponent === "Résultats" && (
          <ResultTournament currentTournamentId={currentTournamentId} />
        )}
        {selectedComponent === "Classement" && (
          <ClassementTournament currentTournamentId={currentTournamentId} />
        )}
      </ScrollView>
    </Animated.ScrollView>
  );
};

export default TournoiScreen;
