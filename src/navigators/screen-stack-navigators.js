import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import FriendsScreen from "../screens/FriendsScreen"
import TourInfoScreen from "../screens/TourInfoScreen";
import CreateTourScreen from "../screens/CreateTourScreen";
import TourModifyScreen from "../screens/TourModifyScreen";
import UploadScreen from "../screens/UploadScreen";

//Add navigators with screens in this file
export const HomeNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Tour: { screen : TourInfoScreen},
  CreateTour: { screen : CreateTourScreen},
  TourModify: { screen : TourModifyScreen}
});

export const FriendsNavigatior = createStackNavigator({
  Friends : { screen : FriendsScreen }
});

export const SettingsNavigator = createStackNavigator({
  Settings: { screen: SettingsScreen }
});

export const ProfileNavigator = createStackNavigator({
  Profile : { screen : ProfileScreen }
})

export const SearchNavigator = createStackNavigator({
  Search: { screen: SearchScreen }
});

export const UploadNavigator = createStackNavigator({
  Upload : {screen : UploadScreen }
})