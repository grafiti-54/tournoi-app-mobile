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
      <ScrollView>
        {/* Slider de card */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {/* Card 1 slider */}
          <Pressable
            style={{
              width: 200,
              height: 150,
              marginTop: 10,
              backgroundColor: "#003580",
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
                marginVertical: 7,
              }}
            >
              Titre 1
            </Text>
            <Text style={{ color: "white", fontSize: 15, fontWeight: "500" }}>
              Description 1
            </Text>
          </Pressable>
          {/* Card 2 slider */}
          <Pressable
            style={{
              width: 200,
              height: 150,
              marginTop: 10,
              borderColor: "#E0E0E0",
              borderWidth: 2,
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 10,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginVertical: 7,
              }}
            >
              Titre 2
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              Description 2
            </Text>
          </Pressable>

          {/* Card 3 slider */}
          <Pressable
            style={{
              width: 200,
              height: 150,
              marginTop: 10,
              borderColor: "#E0E0E0",
              borderWidth: 2,
              borderRadius: 10,
              padding: 20,
              marginHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                marginVertical: 7,
              }}
            >
              Titre 3
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "500" }}>
              Description 3
            </Text>
          </Pressable>
        </ScrollView>
        <Pressable
          style={{
            marginTop: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            style={{ width: 200, height: 50, resizeMode: "cover" }}
            source={{
              uri: "https://res.cloudinary.com/ddx03ty0j/image/upload/v1688817138/TOURNOI-APP_-_Logo_dliuqu.png",
            }}
          />
        </Pressable>
      </ScrollView>
    </Animated.ScrollView>
  );
};

export default HomeScreen;
