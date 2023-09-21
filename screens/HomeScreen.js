import {
  Text,
  View,
  Animated,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import SeacrhMenu from "../components/SeacrhMenu";
import SliderHome from "../components/SliderHome";

//Page d'accueil de l'application.
const HomeScreen = () => {
  const navigation = useNavigation();
  const [seacrhMenuVisible, setSeacrhMenuVisible] = useState(false);
  const scrollRef = useRef();

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
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
            }
          }}
        />
      ),
    });
  }, [seacrhMenuVisible]);


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
        />
      )}
      <Animated.ScrollView style={{ flex: 1 }} ref={scrollRef}>
        <View
          style={{
            //height: "100%",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          {/* Partie 1 - titre */}
          <View
            style={{
              //height: "20%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 30,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 35 }}>
              Bienvenue sur{" "}
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 45, color: "#02a3fe" }}
            >
              TOURNOI-APP
            </Text>
          </View>
          {/* Partie 2 - logo */}
          <View
            style={{
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
              //height: "35%",
            }}
          >
            <Image
              style={{ width: 220, height: 250, resizeMode: "cover" }}
              source={{
                uri: "https://res.cloudinary.com/ddx03ty0j/image/upload/v1688817138/TOURNOI-APP_-_Logo_dliuqu.png",
              }}
            />
          </View>
          {/*Partie 3 - Slider de card */}
          <View style={{ 
            //height: "40%", 
            marginVertical: 30 }}>
            <SliderHome />
          </View>
        </View>
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

export default HomeScreen;
