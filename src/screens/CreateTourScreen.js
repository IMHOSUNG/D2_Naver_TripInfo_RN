import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import UserInfo from "../UserInfo"
import Config from "../Config"

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
      userEmail: UserInfo.email,
      mainImage: Config.defaultImg,
      title: "title",
      description: "description",
      startDay: "2019-01-01",
      endDay: "2019-01-05",
      dayList: ["2019-01-01", "2019-01-02", "2019-01-03", "2019-01-04", "2019-01-05"],
      modifiedTime: null
    };
  }

  handleCreateTour = () => {
    fetch(Config.host + "/post/trip", {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: this.state.userEmail,
        mainImage: this.state.mainImage,
        title: this.state.title,
        description: this.state.description,
        dayList: this.state.dayList,
        modifiedTime: this.state.modifiedTime
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("Create succes", response);
        alert("Create success!");
        this.setState({
          mainImage: Config.defaultImg,
          title: null,
          description: null,
          dayList: [],
          modifiedTime: null
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
        <TextInput style={styles.input} onChangeText={(title) => this.setState({title})} value={this.state.title} />
        <TextInput style={styles.input} onChangeText={(description) => this.setState({description})} value={this.state.description} />
        <TextInput style={styles.input} onChangeText={(startDay) => this.setState({startDay})} value={this.state.startDay} />
        <TextInput style={styles.input} onChangeText={(endDay) => this.setState({endDay})} value={this.state.endDay} />
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