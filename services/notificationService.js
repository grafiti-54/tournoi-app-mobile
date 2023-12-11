// notificationService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    //console.log('Permissions Status:', existingStatus);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    // console.log("Final Permission Status:", finalStatus);
    // console.log("Generated Token:", token);
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    const projectId = Constants.expoConfig.extra.projectId;
    token = await Notifications.getExpoPushTokenAsync({ projectId });
    //console.log("Generated Token:", token);
  } else {
    alert("Vous devez utiliser un téléphone physique pour pouvoir utiliser les notifications!");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export default registerForPushNotificationsAsync;
