import React from "react";
import { Text, View } from "react-native";

const MatchDetail = ({match}) => {
    console.log(match);
  return (
    <View style={{height:200, width:200}}>
      <Text>Contenu de la modal</Text>
    </View>
  );
};

export default MatchDetail;
