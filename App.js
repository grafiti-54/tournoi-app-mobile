//App.js
import React from "react";
import { Provider } from "react-redux";
import StackNavigator from "./StackNavigator";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux/store.js"

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StackNavigator />
      </PersistGate>
    </Provider>
  );
}
