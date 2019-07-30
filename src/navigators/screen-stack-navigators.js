import React, { Component } from "react";
import { createStackNavigator } from "react-navigation";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import SearchScreen from "../screens/SearchScreen";
import FriendsScreen from "../screens/FriendsScreen"
import TourInfoScreen from "../screens/TourInfoScreen";
import TourInfoScreen2 from "../screens/TourInfoScreen2";
import CreateTourScreen from "../screens/CreateTourScreen";
import TourModifyScreen from "../screens/TourModifyScreen";
import TourInfoFetchScreen from "../screens/TourInfoFetchScreen";
import UploadScreen from "../screens/ImageUploadScreen";
import UpdateFriendScreen from "../screens/UpdateFriendScreen";
import LogOutScreen from "../screens/LogOutScreen";
import MarkerModifyScreen from "../screens/MarkerModifyScreen";

//Add navigators with screens in this file
export const HomeNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Tour: { screen : TourInfoScreen},
  CreateTour: { screen : CreateTourScreen},
  Upload : {screen : UploadScreen},
  TourModify: { screen : TourModifyScreen},
  MarkerModify : {screen : MarkerModifyScreen},

},
  {
    headerMode: 'none',
    navigationOptions: ({ navigation }) => {
      let tabBarVisible = true;
      if (navigation.state.index == 1) {
        tabBarVisible = false;
      }
      return { tabBarVisible }
    }
  }
);

export const FriendsNavigatior = createStackNavigator({
  Friends: { screen: FriendsScreen },
  UpdateFriends: { screen: UpdateFriendScreen },
  Tour2: { screen: TourInfoScreen2 },
}, { headerMode: 'none' });

export const SettingsNavigator = createStackNavigator({
  Settings: { screen: SettingsScreen },
  LogOut: { screen: LogOutScreen },

}, { headerMode: 'none' });

export const ProfileNavigator = createStackNavigator({
  Profile: { screen: ProfileScreen }
}, { headerMode: 'none' })

export const SearchNavigator = createStackNavigator({
  Search: { screen: SearchScreen },
  Tour3: { screen: TourInfoScreen2 },
}, { headerMode: 'none' });

export const FetchNavigator = createStackNavigator({
  Upload: { screen: TourInfoFetchScreen }
}, { headerMode: 'none' });
