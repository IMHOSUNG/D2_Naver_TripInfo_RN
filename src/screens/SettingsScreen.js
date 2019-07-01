import { 
  Button,
  View, 
  Text, 
  StyleSheet, 
  AsyncStorage } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import { HeaderBackButton } from "react-navigation";

export default class SettingsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} />,
      headerTitle: <Logo />,
      headerBackTitle: "Settings",
      headerLayoutPreset: "center"
    };
  };
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello! Welcome to my settings page</Text>
      </View>
    );
  }

  _logOutAsync = async() => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
