import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const LoadingSpinner = () => {
  return (
    <View style={{ 
      position: 'absolute', 
      top: 0, 
      right: 0, 
      bottom: 0, 
      left: 0, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }}>
      <ActivityIndicator size="large" color="#02A3FE" />
    </View>
  );
}

export default LoadingSpinner;
