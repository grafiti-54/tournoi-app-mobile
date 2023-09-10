import { StyleSheet} from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font"; 
import Poppins from "./assets/fonts/Poppins-Regular.ttf"
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";

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
    "Poppins": Poppins,
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
          //tabBarActiveTintColor: "#00A149", // Couleur du label et de l'icône quand l'onglet est actif
          //tabBarInactiveTintColor: "white", // Couleur du label et de l'icône quand l'onglet est inactif
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
        {/* Favoris menu en bas de l'écran du téléphone. */}
        {/* <Tab.Screen
          name="Menus"
          component={MenuPizzaScreen}
          options={{
            tabBarLabel: "Nos menus",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons name="pizza" size={34} color="#00A149" /> // icone plein avec focus.
              ) : (
                <Ionicons name="pizza-outline" size={34} color="white" /> // icone vide sans focus.
              ),
            tabBarLabelStyle: {
              color: "white", // change la couleur du label.
              fontSize: 16, // change la taille du label.
              fontFamily: "Poppins",
            },
          }}
        /> */}
        {/* Réservation menu en bas de l'écran du téléphone. */}
        {/* <Tab.Screen
          name="Contact"
          component={ContactScreen}
          options={{
            tabBarLabel: "Contact",
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialCommunityIcons
                  name="contacts"
                  size={34}
                  color="#00A149"
                /> // icone plein avec focus.
              ) : (
                <MaterialCommunityIcons
                  name="contacts-outline"
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
        /> */}
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
          name="menus"
          component={MenuPizzaScreen}
          options={{ headerShown: false }} // cache le header. Sera défini dans chaque screen pour afficher le header dynamiquement.
        />
        <Stack.Screen
          name="contact"
          component={ContactScreen}
          options={{ headerShown: false }} // cache le header. Sera défini dans chaque screen pour afficher le header dynamiquement.
        /> */}
      </Stack.Navigator>
      ) : null}
    </NavigationContainer>
  );;
};

export default StackNavigator;

const styles = StyleSheet.create({});
