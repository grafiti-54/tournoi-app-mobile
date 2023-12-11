import { Text, View, Animated, TouchableWithoutFeedback } from "react-native";
import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import SeacrhMenu from "../components/SeacrhMenu";
import QRCodeScanner from "../components/QRCodeScanner";
import { useDispatch } from "react-redux";
import { resetSearchValue } from "../redux/features/tournoiSlice";


//Page de scan du qr code d'un tournoi avec l'appareil photo.
const QRCodeScreen = () => {
  const navigation = useNavigation();
  const [seacrhMenuVisible, setSeacrhMenuVisible] = useState(false);
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

  const content = (
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
      <Animated.ScrollView style={{ flex: 1 }} ref={scrollRef}>
        <QRCodeScanner />
      </Animated.ScrollView>
    </View>
  );

  return seacrhMenuVisible ? (
    <TouchableWithoutFeedback onPress={() => setSeacrhMenuVisible(false)}>
      {content}
    </TouchableWithoutFeedback>
  ) : (
    content
  );
};

export default QRCodeScreen;
