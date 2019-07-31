import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDrawerNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";
import BottomTabNavigator from "./bottom-tab-navigator";
import SplashScreen from "../screens/SplashScreen"
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import LogOutScreen from "../screens/LogOutScreen";

const Drawer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading : AuthLoadingScreen,
    App : BottomTabNavigator,
    Auth : LoginScreen,
  },
  {
    initialRouteName : 'AuthLoading',
  }
));

const InitialNavigator = createSwitchNavigator({
  Splash: SplashScreen,
  Drawer: Drawer
});

const AppContainer = createAppContainer(InitialNavigator);

export default AppContainer;
