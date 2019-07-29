import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import React, { Component } from "react";

class LoadingScreen extends React.Component {
  render() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>잠시만 기다려주세요...</Text>    
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

export default LoadingScreen;
