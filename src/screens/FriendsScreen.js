import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";

export default class FriendScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <MenuButton onPress={() => navigation.openDrawer()} />,
      headerTitle: <Logo />,
      headerBackTitle: "Friend",
      headerLayoutPreset: "center"
    };
  };

  constructor(props) {
    super(props)
    this.state = {
      name: props.navigation.getParam('name'),
      profile: props.navigation.getParam('response'),
      refreshing: false,
      trip: [],
    };
  }

  getAllTrip = async () => {
    await fetch('http://www.playinfo.co.kr/get/tripall')
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => {
        this.setState({
          trip: resopnseJson
        });
      })
      .catch((error) => {
        console.log('Server is not networking!', error);
        alert('Server is not networking!');
      });
  }

  _onEndReached = async () => {
    await this.getAllTrip();
  };

  _onRefresh = async () => {
    await this.getAllTrip();
  }

  _onPress(item) {
    this.props.navigation.navigate('Tour', item);
  }

  _makeCard = ({item}) => (
    
      <View style={styles.CardContainer}>        
        <TouchableOpacity onPress={() => this._onPress(item)}>
          <Image source={{uri: "http://www.playinfo.co.kr/picture/" + item.mainImage}} style={{width:"100%", height:300, borderRadius: 4}}/>
          <Text style={styles.CardTitle}>{item.content}</Text>
          <Text style={styles.CardContent}>{item.userEmail}</Text> 
        </TouchableOpacity>
      </View>
  );

  async componentDidMount() {
    await this.getAllTrip();
  }

  render() {
    if (this.state.trip && this.state.trip.length > 0)
      return (
        <View>
          <FlatList
            data={this.state.trip}
            initialNumToRender={2}
            onEndReachedThreshold={1}
            onEndReached={this._onEndReached}
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
            renderItem={this._makeCard}
            keyExtractor={(item) => item._id}
          />
        </View>
      );
    else
      return (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />
          }
        >
          <Text>Friends' trip data is not exist.</Text>
        </ScrollView>
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
});
