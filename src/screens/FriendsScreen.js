import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import Config from "../Config"
import UserInfo from "../UserInfo";
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
      loading: true,
      refreshing: false,
      friendList: [],
      trip: [],
    };
  }

  getFriendList = () => {
    fetch(Config.host + '/get/user/friendList/' + UserInfo.id)
      .then((response) => response.json())
      .then((responseJson) => { this.setState({ friendList: responseJson[0].friendList },()=>{this.getAllTrip()}); })
      .catch((error) => { alert('Get Friend List fail!', error); });
    console.log(UserInfo);
  }

  getAllTrip = () => {
    if (this.state.friendList.length == 0) {
      this.setState({ loading: false });
    } else {
      this.state.friendList.map(friendId => {
        fetch(Config.host + '/get/trip/user/' + friendId)
          .then((resopnse) => resopnse.json())
          .then((resopnseJson) => {
            console.log(resopnseJson);
            this.setState({
              trip: resopnseJson,
              loading: false
            });
          })
          .catch((error) => { alert(error); });
      })
    }
  }

  _onEndReached = () => {
    this.getAllTrip();
  };

  _onRefresh = () => {
    this.getFriendList();
  }

  _onPress(item) {
    this.props.navigation.navigate('Tour', item);
  }

  _makeCard = ({ item }) => (

    <View style={styles.CardContainer}>
      <TouchableOpacity onPress={() => this._onPress(item)}>
        <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
        <Text style={styles.CardTitle}>{item.title}</Text>
        <Text style={styles.CardContent}>{item.userEmail}</Text>
        <Text style={styles.CardContent}>{item.dayList[0] + "~" + item.dayList[item.dayList.length - 1]}</Text>
      </TouchableOpacity>
    </View>
  );

  componentDidMount() {
    this.getFriendList();
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
          <Text>Friends' trip data is not exist.</Text>
        </ScrollView>
      );
    }
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
});
