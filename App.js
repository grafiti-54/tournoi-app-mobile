import React, { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import StackNavigator from "./StackNavigator";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.js";
import * as Notifications from "expo-notifications";
import registerForPushNotificationsAsync from "./services/notificationService";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
 
useEffect(() => {
  //console.log("Setting up notification listeners");
  registerForPushNotificationsAsync();

  // Écouteur pour les notifications reçues pendant que l'application est au premier plan
  const foregroundNotificationListener =
    Notifications.addNotificationReceivedListener((notification) => {
      console.log(
        "Foreground Notification Received Body:",
        notification.request.content.body
      );
    });

  // Écouteur pour les notifications reçues pendant que l'application est en arrière-plan
  const backgroundNotificationListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        "Background Notification Response Received Body:",
        response.notification.request.content.body
      );
    });

  return () => {
    foregroundNotificationListener.remove();
    backgroundNotificationListener.remove();
  };
}, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StackNavigator />
      </PersistGate>
    </Provider>
  );
}
