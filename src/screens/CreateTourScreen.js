import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";

export default class CreateTourScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Logo />,
      headerBackTitle: "Tour",
      headerLayoutPreset: "center"
    };
  };

  constructor(props) {
    super(props);
    this.state = { 
      userEmail: "test@naver.com",
      mainImage: "5d21b959ae469443cef69768",
      content: "title",
      allowUser: null,
      startTime: "2019-01-01",
      endTime: "2019-01-05"
    };
  }

  handleCreateTour = () => {
    fetch('http://www.playinfo.co.kr/post/trip', {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: this.state.userEmail,
        mainImage: this.state.mainImage,
        content: this.state.content,
        allowUser: this.state.allowUser,
        startTime: this.state.startTime,
        endTime: this.state.endTime
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("Create succes", response);
        alert(response);
        alert("Create success!");
        this.setState({ 
          userEmail: "test@naver.com",
          mainImage: "5d21b959ae469443cef69768",
          content: "title",
          allowUser: null,
          startTime: "2019-01-01",
          endTime: "2019-01-05"
        });
      })
      .catch(error => {
        console.log("Create error", error);
        alert("Create failed!");
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello! Welcome to create trip page</Text>
        <TextInput style={styles.input} onChangeText={(content) => this.setState({content})} value={this.state.content} />
        <TextInput style={styles.input} onChangeText={(startTime) => this.setState({startTime})} value={this.state.startTime} />
        <TextInput style={styles.input} onChangeText={(endTime) => this.setState({endTime})} value={this.state.endTime} />
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.handleCreateTour()}>
          <Text>확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.pop()}>
          <Text>취소</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    input: {
      height: 40, 
      margin: 10,
      borderColor: 'gray', 
      borderWidth: 1
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 40, 
      margin: 10,
      marginTop: 5,
      marginBottom: 5,
      borderRadius: 5,
      backgroundColor: '#fff',
      borderColor: '#000',
      borderWidth: 1
    }
});