import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Alert } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
//import { FlatList } from "react-native-gesture-handler";
import { randomUsers } from "../util";
import UserInfo from "../UserInfo"

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <MenuButton onPress={() => navigation.openDrawer()} />,
      headerTitle: <Logo />,
      headerBackTitle: "Home",
      headerLayoutPreset: "center"
    };
  };

  constructor(props){
    super(props)
    this.state = {
        name : props.navigation.getParam('name'),
        profile : props.navigation.getParam('response'),
        refreshing: false,
        data : randomUsers(20),
    };
  }

  _onEndReached = async () => {
    await this.setState(state => ({
      data: [
        ...state.data,
        ...randomUsers(),
      ]
    }));
  };

  _onRefresh = async () => {
    await this.setState({
      data: randomUsers(20),
    });
  }

  _onPress(item) {
    this.props.navigation.navigate('Tour', item);
  }

  _makeCard = ({item}) => (
    
      <View style={styles.CardContainer}>
        <TouchableOpacity onPress={() => this._onPress(item)}>
          <Image source={{uri: "http://www.playinfo.co.kr/picture/5d20e72dcde4cc0020a3efee"}} style={{width:"100%", height:300, borderRadius: 4}}/>
          <Text style={styles.CardTitle}>{item.name}</Text>
          <Text style={styles.CardContent}>{UserInfo.email}</Text> 
        </TouchableOpacity>
      </View>
  );

  createTour() {
    this.props.navigation.navigate('CreateTour');
  }

  render() {
    
    return (
      <View>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.createTour()}>
          <Text>여행일지 추가</Text>
        </TouchableOpacity>
        <FlatList
          data={this.state.data}
          initialNumToRender={2}
          onEndReachedThreshold={1}
          onEndReached={this._onEndReached}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          renderItem={this._makeCard}
          keyExtractor={(item) => item.key}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    borderRadius: 30,
    borderWidth: 0.5,
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40, 
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1
  }
});

