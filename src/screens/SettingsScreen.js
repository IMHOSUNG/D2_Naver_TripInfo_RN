import { Image, View, Text, StyleSheet, AsyncStorage, TouchableOpacity, PixelRatio } from "react-native";
import React, { Component } from "react";
import { HeaderBackButton } from "react-navigation";
import UserInfo from "../UserInfo";
import Config from "../Config";

export default class SettingsScreen extends React.Component {
  constructor(props) {
		super(props);
		this.state = { 
      profileImg: null
    }
	}
  getProfileImg = () =>{
    fetch(Config.host + '/get/user/'+UserInfo.id)
      .then(response => response.json())
      .then(responseJson => {console.log(responseJson);this.setState({profileImg: responseJson[0].profileImg},()=>console.log(this.state.profileImg))})
      .catch(error => {
        console.log(error);
      })
  }
  /*
  updateProfileImg = () =>{
    fetch(Config.host +'update/user/profileImg/'+UserInfo.id,{
      method:"POST",
      headers:{
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      Body
    })
  } */ 
  componentDidMount(){
    this.getprofileImg();
  }
  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.profileImg} source={{uri:Config.host+'/picture/'+this.state.profileImg}}/>
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
    alignItems: 'center',
    justifyContent: "center"
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
		height: 40, 
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1
  },
  profileImg: {
    height: 300,
    width : 300,

    borderRadius: 3000/PixelRatio.get(),
  },
});
