//App.js
import React from "react";
import { Provider } from "react-redux";
import StackNavigator from "./StackNavigator";
import store from "./redux/store";

export default function App() {
  return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
  );
}
