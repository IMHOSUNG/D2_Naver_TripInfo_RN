import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createDrawerNavigator, createAppContainer, createSwitchNavigator } from "react-navigation";
import BottomTabNavigator from "./bottom-tab-navigator";
import { SettingsNavigator, ProfileNavigator } from "./screen-stack-navigators";
import SplashScreen from "../screens/SplashScreen"
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import LoginScreen from "../screens/LoginScreen";
import LogOutScreen from "../screens/LogOutScreen";

/*
const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen : BottomTabNavigator,
      navigationOptions : {
        drawerLabel : 'Home',
        drawerIcon : ({focused, tintColor}) => {
            let IconComponent = Ionicons;
            return <IconComponent name = {"ios-home"} size = {25} color = {tintColor} />;
        },
      }
    },
    Settings: {
      screen : SettingsNavigator,     
      navigationOptions : {
        drawerLabel : 'Setting',
        drawerIcon : ({focused, tintColor}) => {
          let IconComponent = Ionicons;
          return <IconComponent name = {"ios-settings"} size = {25} color = {tintColor} />;
        },
      }
    },
    ProfileScreen : {
      screen : ProfileNavigator,
      navigationOptions : {
        drawerLabel : 'Profile',
        drawerIcon : ({focused, tintColor}) => {
          let IconComponent = Ionicons;
          return <IconComponent name = {"ios-person"} size = {25} color = {tintColor} />;
        },
      }
    },
    LogOut : {
      screen : LogOutScreen,
      navigationOptions : {
        drawerLabel : 'LogOut',
        drawerIcon : ({focused, tintColor}) => {
          let IconComponent = Ionicons;
          return <IconComponent name = {"ios-log-out"} size = {25} color = {tintColor} />;
        },
      }
    }
  },
  {
    // 왼쪽에서 오른쪽 슬라이드 할 때 menu 창 켜지는 것 막기
    drawerLockMode : "locked-closed",
  }
);
*/

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
