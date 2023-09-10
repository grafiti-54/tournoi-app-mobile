import { ScrollView, StyleSheet, Text, View, Animated } from "react-native";
import React, { useLayoutEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../components/Header";
import FuturTournamentList from './../components/FuturTournamentList';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isHeaderVisible, setHeaderVisible] = useState(false);
  const scrollRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View style={{ alignItems: "center" }}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: "bold",
              color: "white",
              fontFamily: "Poppins",
              fontWeight: "400",
              color:"#02A3FE",
              fontWeight:"bold"
            }}
          >
            TOURNOI-APP
          </Text>
        </View>
      ),

      headerTitleStyle: {
        fontSize: 25,
        fontWeight: "bold",
        color: "white",
        transform: [{ rotate: "-10deg" }],
        fontFamily: "Poppins",
        fontWeight: "400", // preciser fontWeight pour modifier la fontFamily.
      },
      headerStyle: {
        backgroundColor: "#090915",
        height: 110,
        borderBottomColor: "transparent", // supprime la séparation de l'élément.
        shadowColor: "transparent", // supprime la séparation de l'élément.
      },
      headerRight: () => (
        <FontAwesome
          name="search"
          size={24}
          color="white"
          style={{ marginRight: 12 }}
          //Affiche/cache le sous menu de recherche lors du clic sur la loupe.
          onPress={() => {
            setHeaderVisible(!isHeaderVisible);
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
            }
          }}
        />
      ),
    });
  }, [isHeaderVisible]);

  return (
    <Animated.ScrollView style={{ flex: 1 }} ref={scrollRef}>
      {isHeaderVisible && <Header />}
      <FuturTournamentList/>
    </Animated.ScrollView>
  );
};

export default HomeScreen;
