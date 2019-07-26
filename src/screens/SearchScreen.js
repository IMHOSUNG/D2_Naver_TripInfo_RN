import {Image,FlatList, View, Text, StyleSheet, TextInput,TouchableOpacity } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import Config from "../Config"

export default class SearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <MenuButton onPress={() => navigation.openDrawer()} />,
      headerTitle: <Logo />,
      headerBackTitle: "Search",
      headerLayoutPreset: "center"
    };
  };

  constructor(props) {
    super(props)
    this.state = {
      search : 'undefined',
      isloading : true,
    };
    this.arrayholder = [];
  }

  //search url 따로 만들어서 하기 
  async searchDB() {
    //console.log(Config.host + '/get/search/trip/'+ String(this.state.search));
    await fetch(Config.host + '/get/search/trip/'+ String(this.state.search))
    .then((resopnse) => resopnse.json())
    .then((resopnseJson) => { 
      console.log(resopnseJson); 
      var joined = this.arrayholder.concat(resopnseJson);
      this.setState({ arrayholder: joined })
      })
    .catch((error) => { alert(error); });
  }

  _onPress(item) {
    this.props.navigation.navigate('Tour', item);
  }
  
  //search 하는 부분 url 어떻게 만들 것인지 생각해보기
  _makeCard = ({ item }) =>{ 
    if(item.doctype == "trip"){
      return(
      <View style={styles.CardContainer}>
        <TouchableOpacity activeOpacity={0.6}>
        <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
          <Text style={styles.CardTitle}>여행 {item.title}</Text>
          <Text style={styles.CardContent}>{item.dayList[0] + "~" + item.dayList[item.dayList.length - 1]}</Text>
        </TouchableOpacity>
      </View>
      )
    }
    else{
      return(
      <View style={styles.CardContainer}>
        <TouchableOpacity activeOpacity={0.6}>
          <Text style={styles.CardTitle}>여행 {item.title}</Text>
          <Text style={styles.CardContent}>{item.dayList[0] + "~" + item.dayList[item.dayList.length - 1]}</Text>
        </TouchableOpacity>
      </View>
      )
    }
  };

  render() {
    return (
      <View style={styles.container}>
      <TextInput style={styles.textBox} returnKeyType={'search'} onChangeText={(search) => this.setState({search})} onSubmitEditing={()=>this.searchDB()} />
      <TouchableOpacity style = {styles.visibilityBtn} onPress={() => this.searchDB()}>
        <Text>검색</Text>
      </TouchableOpacity>
      <FlatList
        data = {this.state.arrayholder}
        renderItem = {this._makeCard}
        keyExtractor = {(item) => item._id}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //alignItems: "center",
    //justifyContent: "center"
  },
  textBox:
  {
    fontSize: 18,
    alignSelf: 'stretch',
    height: 45,
    paddingRight: 45,
    paddingLeft: 8,
    borderWidth: 1,
    paddingVertical: 0,
    borderColor: 'grey',
    borderRadius: 5
  },
 
  visibilityBtn:
  {
    position: 'absolute',
    right: 3,
    height: 50,
    width: 50,
    padding: 5
  },
  CardContainer: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    margin: 20,
  },
  CardTitle: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 20,
    padding: 3
  },
  CardContent: {
    width: '100%',
    fontSize: 12,
    padding: 3
  },
});
