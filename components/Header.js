import {  View, TextInput } from "react-native";
import React from "react";
import { setSearchValue } from "../redux/features/tournoiSlice";
import { useDispatch, useSelector } from "react-redux";



const Header = () => {

  const dispatch = useDispatch();
  const searchValue = useSelector((state) => state.tournoi.searchValue);

  const handleSearchChange = (text) => {
    dispatch(setSearchValue(text));
  };

  return (
    <View
      style={{
        backgroundColor: "#02A3FE",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      <View
        style={{
          height: 1,
          width: "70%",
          backgroundColor: "lightgray",
          alignSelf: "center",
          marginVertical: 8,
        }}
      />
      {/* Input de recherche */}
      <TextInput
        style={{
          height: 40,
          width: "80%",
          borderColor: "gray",
          borderWidth: 1,
          borderRadius: 5,
          backgroundColor: "white",
          paddingHorizontal: 10,
          alignSelf: "center",
          marginBottom: 8,
        }}
        placeholder="Rechercher"
        value={searchValue}
        onChangeText={handleSearchChange}
      />
    </View>
  )
}

export default Header