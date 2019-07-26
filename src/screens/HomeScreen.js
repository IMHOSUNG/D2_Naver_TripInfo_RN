import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl, Modal } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import UserInfo from "../UserInfo"
import Config from "../Config"
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: <MenuButton onPress={() => navigation.openDrawer()} />,
      headerTitle: <Logo />,
      headerBackTitle: "Home",
      headerLayoutPreset: "center"
    };
  };

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      refreshing: false,
      modalVisible: false,
      trip: [],
    };
  }

  getMyTrip = () => {
    fetch(Config.host + '/get/trip/user/' + UserInfo.id)
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => { console.log(resopnseJson);this.setState({ trip: resopnseJson, loading: false }); })
      .catch((error) => { alert(error); });
  }

  createTour() {
    this.props.navigation.navigate('CreateTour');
  }
  
  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible }, ()=> console.log(this.state.modalVisible));
  }

  modifyTour(item) {
    const { tripId, title, description, dayList } = item;
    this.props.navigation.navigate('TourModify', { tripId: tripId, title: title, description: description, dayList: dayList });
  }

  deleteTour = (item) => {
    fetch(Config.host + '/delete/trip/' + item.tripId)
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => { console.log(resopnseJson); })
      .catch((error) => { alert(error); });
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
      <TouchableOpacity onPress={() => this._onPress(item)} onLongPress={() => this.toggleModal()} activeOpacity={0.6}>
        <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
        <Text style={styles.CardTitle}>{item.title}</Text>
        <Text style={styles.CardContent}>{item.dayList[0] + "~" + item.dayList[item.dayList.length - 1]}</Text>
        <Menu>
              <MenuTrigger text={'설정'} />
              <MenuOptions>
                <MenuOption onSelect={()=>this.deleteTour(item)} text="삭제" />
                <MenuOption onSelect={()=>this.modifyTour(item)} text="수정" />
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
    } else {
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
  }

  render() {
    return (
      <View style={styles.container} >{this.state.loading ? <Text>Loading...</Text> : this.renderList(this.state.trip)}</View>
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
  },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  }
});

