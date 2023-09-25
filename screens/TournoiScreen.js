import {
  Text,
  View,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import SeacrhMenu from "../components/SeacrhMenu";
import HeaderTournament from "../components/HeaderTournament";
import { useDispatch, useSelector } from "react-redux";
import InformationTournament from "../components/InformationTournament";
import ResultTournament from "../components/ResultTournament";
import ClassementTournament from "../components/ClassementTournament";
import { fetchTournamentById } from "../redux/features/tournoiSlice";
import NoFollowTournament from "../components/NoFollowTournament";
import { resetSearchValue } from "../redux/features/tournoiSlice";
import { fetchAllMatch } from "../redux/features/matchSlice";

//Screen détails du tournoi divisé en 3 partie ( info, matchs , classements)
const TournoiScreen = () => {
  const currentTournamentId = useSelector(
    (state) => state.tournoi.currentTournamentId
  );
  const tournoi = useSelector(
    (state) => state.tournoi.data[currentTournamentId]
  );
  const navigation = useNavigation();
  const [seacrhMenuVisible, setSeacrhMenuVisible] = useState(false);
  const scrollRef = useRef();
  const [selectedComponent, setSelectedComponent] = useState("Informations");
  const dispatch = useDispatch();
  //console.log("id récupéré lors de la navigation", currentTournamentId);
  //console.log("Information du tournoi : ", tournoi);

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
              dispatch(resetSearchValue()); // Réinitialisez la valeur de recherche lorsque le menu est sur "close"
            }
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
            }
          }}
        />
      ),
    });
  }, [seacrhMenuVisible]);

  // Cette fonction sera appelée lorsque l'utilisateur ajoute un tournoi à sa liste de favoris.
  const handleAddToFavorites = () => {
    setSeacrhMenuVisible(false);
  };

  //Vérification si récupération d'un tournoi.
  useEffect(() => {
    dispatch(fetchTournamentById(currentTournamentId));
  }, [currentTournamentId, dispatch]);

  const renderContent = () => {
    if (!tournoi) {
      return <NoFollowTournament />;
    }

    // console.log(currentTournamentId);

    return (
      <Animated.ScrollView style={{ flex: 1 }} ref={scrollRef}>
        <HeaderTournament
          setSelectedComponent={setSelectedComponent}
          showClassementButton={tournoi?.tournamentType === "championnat"}
        />
        <ScrollView>
          {selectedComponent === "Informations" && (
            <InformationTournament currentTournamentId={currentTournamentId} />
          )}
          {selectedComponent === "Résultats" && (
            <ResultTournament
              tournamentType={tournoi?.tournamentType}
              currentTournamentId={currentTournamentId}
            />
          )}
          {selectedComponent === "Classement" &&
            tournoi?.tournamentType === "championnat" && (
              <ClassementTournament
                tournamentType={tournoi?.tournamentType}
                currentTournamentId={currentTournamentId}
              />
            )}
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
          onAddToFavorites={handleAddToFavorites}
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

export default TournoiScreen;
