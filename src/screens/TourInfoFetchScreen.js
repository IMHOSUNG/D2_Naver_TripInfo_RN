import { View, Text, StyleSheet, Button, Image } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";

export default class TourInfoFetchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Logo />,
      headerBackTitle: "Tour",
      headerLayoutPreset: "center"
    };
  };
  constructor(props){
      super(props)
      this.state = {
          name : props.navigation.getParam('name'),
          dataSource : '',
      };
  }

  _onPress() {
    this.props.navigation.navigate('Upload');
  }

  componentDidMount(){
    return fetch('http://www.playinfo.co.kr/get/dayall')
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson);
        this.setState({
          isLoading: false,
          dataSource: responseJson[2],
          
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  _returnUri() {

    var imgid = this.state.dataSource.markerImage;
    var uri = 'http://www.playinfo.co.kr/get/img/' + String(imgid);
    console.log(uri);
    return String(uri);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text> this is name </Text>
        <Text>{this.state.name}</Text>
        <Text> day 정보에서 가져온 image id</Text>
        <Text> {this.state.dataSource.markerImage} </Text>
        <Image
          style = { {width : 200, height : 200}}
          source = {{uri : this._returnUri()}}
        />
        <Button onPress={()=>this._onPress()} title = "move"/>
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
