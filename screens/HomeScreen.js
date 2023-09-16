import {
  Text,
  View,
  Animated,
  Pressable,
  ScrollView,
  Image,
} from "react-native";
import React, { useLayoutEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import SeacrhMenu from "../components/SeacrhMenu";
import SliderHome from "../components/SliderHome";

//Page d'accueil de l'application.
const HomeScreen = () => {
  const navigation = useNavigation();
  const [seacrhMenuVisible, setSeacrhMenuVisible] = useState(false);
  const scrollRef = useRef();

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
      <View>
        <View style={{ flex: 1, marginTop: 20 }}>
          <Text>Titre</Text>
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 220, height: 250, resizeMode: "cover" }}
            source={{
              uri: "https://res.cloudinary.com/ddx03ty0j/image/upload/v1688817138/TOURNOI-APP_-_Logo_dliuqu.png",
            }}
          />
        </View>
        {/* Slider de card */}
        <View style={{ flex: 1, marginTop: 20 }}>
          <SliderHome />
        </View>
      </View>
    </Animated.ScrollView>
  );
};

export default HomeScreen;
