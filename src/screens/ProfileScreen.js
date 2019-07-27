import { View, Text, StyleSheet } from "react-native";
import React, { Component } from "react";
import UserInfo from "../UserInfo"

export default class ProfileScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello! My profile is</Text>
        <Text>ID: {UserInfo.id}</Text>
        <Text>Email: {UserInfo.email}</Text>
        <Text>Name: {UserInfo.name}</Text>
        <Text>Nickname: {UserInfo.nickname}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
