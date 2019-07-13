import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import UserInfo from "../UserInfo"
import Config from "../Config"

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
        loading: true,
        refreshing: false,
        trip: [],
    };
  }

  getMyTrip = async () => {
    fetch(Config.host + '/get/trip/' + UserInfo.email)
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => { this.setState({ trip: resopnseJson, loading: false }); })
      .catch((error) => { alert(error); });
  }

  _onEndReached = async () => {
    await this.getMyTrip();
  };

  _onRefresh = async () => {
    await this.getMyTrip();
  }

  _onPress(item) {
    this.props.navigation.navigate('Tour', item);
  }

  _makeCard = ({item}) => (
    
      <View style={styles.CardContainer}>
        <TouchableOpacity onPress={() => this._onPress(item)}>
          <Image source={{uri: Config.host + "/picture/" + item.mainImage}} style={{width:"100%", height:300, borderRadius: 4}}/>
          <Text style={styles.CardTitle}>{item.content}</Text>
          <Text style={styles.CardContent}>{item.startTime + "~" + item.endTime}</Text>
        </TouchableOpacity>
      </View>
  );

  createTour() {
    this.props.navigation.navigate('CreateTour');
  }

  async componentDidMount() {
    await this.getMyTrip();
  }

  renderList = data => {
    if (data && data.length > 0)
      return (
        <View>
          <TouchableOpacity style={styles.buttonContainer} onPress={() => this.createTour()}>
            <Text>여행일지 추가</Text>
          </TouchableOpacity>
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
    else
      return (
        <View><TouchableOpacity style={styles.buttonContainer} onPress={() => this.createTour()}>
          <Text>여행일지 추가</Text>
        </TouchableOpacity>
          <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
            <Text>My trip data is not exist.</Text>
          </ScrollView>
        </View>
      );
  }

  render() {
    
    return (
      <View>{this.state.loading ? <Text>Loading...</Text> : this.renderList(this.state.trip)}</View>
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

