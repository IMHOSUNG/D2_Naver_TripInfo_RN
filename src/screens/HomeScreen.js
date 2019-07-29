import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import React, { Component } from "react";
import UserInfo from "../UserInfo"
import Config from "../Config"
import LoadingScreen from "./LoadingScreen";

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      refreshing: false,
      trip: [],
    };
  }

  getMyTrip = () => {
    fetch(Config.host + '/get/trip/user/' + UserInfo.id)
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => { console.log(resopnseJson); this.setState({ trip: resopnseJson, loading: false }); })
      .catch((error) => { alert(error); });
  }

  createTour() {
    this.props.navigation.navigate('CreateTour');
  }

  modifyTour(item) {
    const { tripId, title, description, dayList } = item;
    this.props.navigation.navigate('TourModify', { tripId: tripId, title: title, description: description, dayList: dayList });
  }

  deleteTour = (item) => {
    fetch(Config.host + '/delete/trip', { 
      method: "POST",
      header: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      body:{
        tripId : item._id
      }
    })
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => { console.log(resopnseJson); })
      .catch((error) => { alert(error); });
    this.props.navigation.navigate('Home')
  }

  _onEndReached = () => {
    this.getMyTrip();
  };

  _onRefresh = () => {
    this.getMyTrip();
  }

  _onPress(item) {
    this.props.navigation.navigate('Tour', item);
  }

  _makeCard = ({ item }) => (
    <MenuProvider>
      <View style={styles.CardContainer}>
        <TouchableOpacity onPress={() => this._onPress(item)}>
          <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
          <Text style={styles.CardTitle}>{item.title}</Text>
          <Text style={styles.CardContent}>{item.dayList[0] + "~" + item.dayList[item.dayList.length - 1]}</Text>
          <Menu>
            <MenuTrigger text={'설정'} />
            <MenuOptions>
              <MenuOption onSelect={() => this.deleteTour(item)} text="삭제" />
              <MenuOption onSelect={() => this.modifyTour(item)} text="수정" />
            </MenuOptions>
          </Menu>
        </TouchableOpacity>
      </View>
    </MenuProvider>
  );

  componentWillMount() {
    this.getMyTrip();
  }

  renderList = data => {
    if (data && data.length > 0) {
      return (
        <View>
          <FlatList
            data={data}
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
    } else {
      return (
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
          <Text>My trip data is not exist.</Text>
        </ScrollView>
      );
    }
  }

  render() {
    return (
      <View style={styles.container} >
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.createTour()}>
          <Text>여행일지 추가</Text>
        </TouchableOpacity>
        {this.state.loading ? <LoadingScreen/> : this.renderList(this.state.trip)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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