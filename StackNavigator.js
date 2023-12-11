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
import MesFavorisScreen from "./screens/MesFavorisScreen";

const StackNavigator = () => {
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

  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  //Menu en bas de l'écran du téléphone.
  function BottomTabs() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            height: 90,
            width: "95%",
            backgroundColor: "#090915",
            marginRight: "auto",
            marginLeft: "auto",
            marginBottom:20,
            borderRadius:35
          },
        }}
      >
        {/* Accueil menu en bas de l'écran du téléphone. */}
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Accueil",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={40} color="#02A3FE" /> // icone plein avec focus.
              ) : (
                <AntDesign name="home" size={40} color="white" /> // icon blanc sans focus.
              ),
            tabBarLabelStyle: {
              color: "white",
              fontSize: 13,
              fontFamily: "Poppins",
            },
          }}
        />
        {/* Mes tournois menu en bas de l'écran du téléphone. */}
        <Tab.Screen
          name="Tournoi detail" // name à utiliser lors de l'utilisation de navigation.navigate("Home".....
          component={TournoiScreen}
          options={{
            tabBarLabel: "Tournoi",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialCommunityIcons
                  name="tournament"
                  size={40}
                  color="#02A3FE"
                /> // icone plein avec focus.
              ) : (
                <MaterialCommunityIcons
                  name="tournament"
                  size={40}
                  color="white"
                /> // icone vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white", // change la couleur du label.
              fontSize: 13, // change la taille du label.
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
                <MaterialIcons name="favorite" size={40} color="#02A3FE" /> // icone plein avec focus.
              ) : (
                <MaterialIcons
                  name="favorite-outline"
                  size={40}
                  color="white"
                /> // icone vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white", // change la couleur du label.
              fontSize: 13, // change la taille du label.
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
                <AntDesign name="qrcode" size={40} color="#02A3FE" /> // icone plein avec focus.
              ) : (
                <AntDesign name="qrcode" size={40} color="white" /> // icone vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white",
              fontSize: 13,
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
        </Stack.Navigator>
      ) : null}
    </NavigationContainer>
  );
};

export default StackNavigator;
