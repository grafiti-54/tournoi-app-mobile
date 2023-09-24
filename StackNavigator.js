import { StyleSheet } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import Poppins from "./assets/fonts/Poppins-Regular.ttf";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import QRCodeScreen from "./screens/QRCodeScreen";

import TournoiScreen from "./screens/TournoiScreen";
import MesFavorisScreen from './screens/MesFavorisScreen';

const StackNavigator = () => {
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  //Supprime le theme(blanc) d'origine de react-navigation.
  const navTheme = {
    colors: {
      background: "transparent",
    },
  };

  //Chargement de la font de l'application.
  const [isFontLoaded] = useFonts({
    Poppins: Poppins,
  });

  //Menu en bas de l'écran du téléphone.
  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 80,
            backgroundColor: "#090915",
            //#02A3FE
          },
        }}
      >
        {/* Accueil menu en bas de l'écran du téléphone. */}
        <Tab.Screen
          name="Home" // name à utiliser lors de l'utilisation de navigation.navigate("Home".....
          component={HomeScreen}
          options={{
            tabBarLabel: "Accueil",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={34} color="#02A3FE" /> // icone plein avec focus.
              ) : (
                <AntDesign name="home" size={34} color="white" /> // icon vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white", // change la couleur du label.
              fontSize: 16, // change la taille du label.
              fontFamily: "Poppins",
            },
          }}
        />
        {/* Mes tournois menu en bas de l'écran du téléphone. */}
        <Tab.Screen
          name="Tournoi detail"
          component={TournoiScreen}
          options={{
            tabBarLabel: "Tournoi",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialCommunityIcons
                  name="tournament"
                  size={34}
                  color="#02A3FE"
                /> // icone plein avec focus.
              ) : (
                <MaterialCommunityIcons
                  name="tournament"
                  size={34}
                  color="white"
                /> // icone vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white", // change la couleur du label.
              fontSize: 16, // change la taille du label.
              fontFamily: "Poppins",
            },
          }}
        />
        <Tab.Screen
          name="Favoris"
          component={MesFavorisScreen}
          options={{
            tabBarLabel: "Favoris",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialIcons name="favorite" size={34} color="#02A3FE" /> // icone plein avec focus.
              ) : (
                <MaterialIcons
                  name="favorite-outline"
                  size={34}
                  color="white"
                /> // icone vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white", // change la couleur du label.
              fontSize: 16, // change la taille du label.
              fontFamily: "Poppins",
            },
          }}
        />
        {/* QR Code menu en bas de l'écran du téléphone. */}
        <Tab.Screen
          name="Menus"
          component={QRCodeScreen}
          options={{
            tabBarLabel: "QR Code",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <AntDesign name="qrcode" size={34} color="#02A3FE" /> // icone plein avec focus.
              ) : (
                <AntDesign name="qrcode" size={34} color="white" /> // icone vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white",
              fontSize: 16,
              fontFamily: "Poppins",
            },
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isFontLoaded ? (
        <Stack.Navigator>
          <Stack.Screen
            name="Main"
            component={BottomTabs}
            options={{ headerShown: false }}
          />
          {/* <Stack.Screen
            name="TournamentDetails"
            component={TournoiScreen}
            options={{ headerTitle: "Détails du Tournoi" }}
          /> */}
        </Stack.Navigator>
      ) : null}
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
