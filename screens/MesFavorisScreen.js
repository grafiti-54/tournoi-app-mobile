import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Text, View, Animated, TouchableWithoutFeedback, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import SeacrhMenu from "../components/SeacrhMenu";
import { useDispatch, useSelector } from "react-redux";
import { resetSearchValue } from "../redux/features/tournoiSlice";
import HeaderFavoris from "./../components/HeaderFavoris";
import MesTournoisFavoris from "../components/Favoris/MesTournoisFavoris";
import MesMatchsFavoris from "../components/Favoris/MesMatchsFavoris";
import NoFollowTournament from "../components/NoFollowTournament";

//Page qui regroupe la liste des tournois et les matchs suivi par l'utilisateur.
const MesFavorisScreen = () => {

  const currentTournamentId = useSelector(
    (state) => state.tournoi.currentTournamentId
  );
  const tournoi = useSelector(
    (state) => state.tournoi.data[currentTournamentId]
  );

  const navigation = useNavigation();
  const [seacrhMenuVisible, setSeacrhMenuVisible] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Tournois");
  const scrollRef = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribeFocus = navigation.addListener("focus", () => {
      // Fermez le menu de recherche lorsque la page est mise au point
      if (seacrhMenuVisible) {
        setSeacrhMenuVisible(false);
      }
    });

    return () => {
      unsubscribeFocus();
    };
  }, [navigation, seacrhMenuVisible]);

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
          name={seacrhMenuVisible ? "close" : "search"}
          size={24}
          color="white"
          style={{ marginRight: 12 }}
          //Affiche/cache le sous menu de recherche lors du clic sur la loupe.
          onPress={() => {
            setSeacrhMenuVisible(!seacrhMenuVisible);
            if (!seacrhMenuVisible) {
              dispatch(resetSearchValue()); // Réinitialise la valeur de recherche lorsque le menu est sur "close"
            }
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
            }
          }}
        />
      ),
    });
  }, [seacrhMenuVisible]);

  const renderContent = () => {
    if (!tournoi) {
      return <NoFollowTournament />;
    }

    return (
      <Animated.ScrollView style={{ flex: 1 }} ref={scrollRef}>
        <HeaderFavoris setSelectedComponent={setSelectedComponent} />
        <ScrollView>
          {selectedComponent === "Tournois" && <MesTournoisFavoris />}
          {selectedComponent === "Matchs" && <MesMatchsFavoris />}
        </ScrollView>
      </Animated.ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {seacrhMenuVisible && (
        <SeacrhMenu
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
          }}
        />
      )}
      {seacrhMenuVisible ? (
        <TouchableWithoutFeedback onPress={() => setSeacrhMenuVisible(false)}>
          {renderContent()}
        </TouchableWithoutFeedback>
      ) : (
        renderContent()
      )}
    </View>
  );
};

export default MesFavorisScreen;
