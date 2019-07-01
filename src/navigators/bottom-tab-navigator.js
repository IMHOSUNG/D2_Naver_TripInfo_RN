import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "react-navigation";
import {
  HomeNavigator,
  CameraNavigator,
  SearchNavigator,
  FriendsNavigatior
} from "./screen-stack-navigators";

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let IconComponent = Ionicons;
  let iconName;
  if (routeName === "MyTour") {
    iconName = "ios-home";
  } else if (routeName === "Friends") {
    iconName = "ios-contacts";
  } else if (routeName === "Search") {
    iconName = "ios-search";
  } else if (routeName === "Camera") {
    iconName = "ios-camera";
  }

  return <IconComponent name={iconName} size={25} color={tintColor} />;
};

const BottomTabNavigator = createBottomTabNavigator(
  {
    MyTour: HomeNavigator,
    Friends : FriendsNavigatior,
    Search: SearchNavigator,
    Camera: CameraNavigator,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor)
    }),
    tabBarOptions: {
      activeTintColor: "black",
      inactiveTintColor: "gray"
    },
  }
);

export default BottomTabNavigator;
