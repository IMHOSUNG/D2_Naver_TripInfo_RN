import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl, Modal } from "react-native";
import { MenuProvider, Menu, MenuTrigger, MenuOptions, MenuOption } from 'react-native-popup-menu';
import React, { Component } from "react";
import UserInfo from "../UserInfo"
import Config from "../Config"
import LoadingScreen from "./LoadingScreen";
import CommonStyles from "../CommonStyles"

export default class HomeScreen extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      refreshing: false,
      trip: [],
      visable: false,
      modalstate: null
    };
  }

  getMyTrip = () => {
    fetch(Config.host + '/get/trip/user/' + UserInfo.id)
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => resopnseJson.sort((a, b) => {
        if (a.modifiedTime < b.modifiedTime) return 1;
        else return -1;
      })
      )
      .then((resopnseJson) => { this.setState({ trip: resopnseJson, loading: false }); })
      .catch((error) => { alert(error); });
  }

  createTour() {
    this.props.navigation.navigate('CreateTour');
  }

  modifyTour = (item) => {
    //const { tripId, title, description, dayList } = item;
    this.props.navigation.navigate('TourModify', item);
  }
  toggleModal = () =>{
    this.setState({visable : !this.state.visable});
  }
  deleteTour = async (item) => {
    fetch(Config.host + '/delete/trip', { 
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tripId: item._id
      })
    })
      .then((resopnse) => {resopnse.json()})
      .then((resopnseJson) => { return console.log(resopnseJson); })
      .catch((error) => { return alert(error); });
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
      <View style={styles.CardContainer}>
        <TouchableOpacity onPress={() => this._onPress(item)} onLongPress={()=> {this.toggleModal(); this.setState({modalstate:item})}}>
          <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
          <Text style={styles.CardTitle}>{item.title}</Text>
          <Text style={styles.CardContent}>{item.dayList[0] + "~" + item.dayList[item.dayList.length - 1]}</Text>
        </TouchableOpacity>
      </View>
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
        <TouchableOpacity style={CommonStyles.buttonContainer} onPress={() => this.createTour()}>
          <Text style={CommonStyles.text}>여행일지 추가</Text>
        </TouchableOpacity>
        {this.state.loading ? <LoadingScreen/> : this.renderList(this.state.trip)}
        <Modal 
          transparent={true} animationType={"fade"} 
          onRequestClose={()=>this.toggleModal()} visible={this.state.visable}>
          <View style={CommonStyles.modal}>
            <View style={CommonStyles.modalcontainer}>
            <TouchableOpacity style={CommonStyles.popupMenu} onPress={()=>{this.toggleModal(); this.modifyTour(this.state.modalstate);}}>
                <Text>수정</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={CommonStyles.popupMenu} 
                onPress={()=>{
                  this.toggleModal(); 
                  this.deleteTour(this.state.modalstate)
                  .then(this.getMyTrip())
                  }}>
                <Text>삭제</Text>
              </TouchableOpacity>
              <TouchableOpacity style={CommonStyles.buttonContainer} onPress={()=>this.toggleModal()}>
                <Text style={CommonStyles.text}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    paddingBottom : "10%",
  },
  CardContainer: {
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: "white",
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
  }
});