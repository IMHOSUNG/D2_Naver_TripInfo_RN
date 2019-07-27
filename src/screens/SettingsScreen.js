import { 
  Button,
  View, 
  Text, 
  StyleSheet, 
  AsyncStorage,
  TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { HeaderBackButton } from "react-navigation";
import UserInfo from "../UserInfo";

export default class SettingsScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello! Welcome to my settings page</Text>

        <Text>Hello! My profile is</Text>
        <Text>ID: {UserInfo.id}</Text>
        <Text>Email: {UserInfo.email}</Text>
        <Text>Name: {UserInfo.name}</Text>
        <Text>Nickname: {UserInfo.nickname}</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this._logOutAsync()}>
            <Text>로그아웃</Text>
          </TouchableOpacity>
      </View>
    );
  }

  _logOutAsync = async() => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('LogOut');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
