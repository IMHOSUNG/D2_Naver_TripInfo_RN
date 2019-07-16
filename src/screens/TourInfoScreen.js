import { View, ScrollView, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";

export default class TourInfoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Logo />,
      headerBackTitle: "Tour",
      headerLayoutPreset: "center"
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      tripId: props.navigation.getParam('_id'),
      title: props.navigation.getParam('title'),
      description: props.navigation.getParam('description'),
      dayList: props.navigation.getParam('dayList'),
      startDay: dayList[0],
      endDay: dayList[dayList.length - 1],
      latitude: 37.550462,    // default latitude
      longitude: 126.994100,  // default longitude
      latitudeDelta: 0.05,    // default latitudeDelta
      longitudeDelta: 0.05,   // default longitudeDelta
      markerList: [],
      day: []
    };
  }

  getMarker = () => {
    fetch(Config.host + '/get/marker/' + this.state.tripId)
      .then((resopnse) => resopnse.json())
      .then((resopnseJson) => { resopnseJson.sort((a, b) => a.timeStamp < b.timeStamp); })
      .them((resopnseJson) => this.setState({ markerList: resopnseJson }))
      .catch((error) => { alert('Get Marker fail!', error); });
  }

  initTourInfo() {
    if (this.state.markerList.length == 0) {
      this.setState({ loading: false });
    } else {
      var index = 1;
      var currentDay = this.state.markerList[0].day;
      this.state.markerList.map(marker => {
        if (this.state.markerList.length == 0) {
          this.setState({ day: [{ "index": index, "marker": [marker] }] });
        } else if (currentDay == marker.day) {
          this.setState({ day: day.map(dayItem => 
            index == dayItem.index ? { "index": dayItem.index, "marker": [ ...push.dayItem.marker, ...marker] } : dayItem) });
        } else {
          index++;
          this.setState({
            day: [
              ...state.day,
              ...{ "index": index, "marker": [marker] },
            ]
          });
        }
      })
        .then(this.setState({ loading: false }));
    }
  }

  changeDay = (day) => {
    alert(day);
  }

  modify() {
    const { tripId, title, description, dayList } = this.state;
    this.props.navigation.navigate('TourModify', { tripId: tripId, title: title, description: description, dayList: dayList });
  }

  async componentDidMount() {
    await this.getMarker();
    await this.initTourInfo()
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.mapContainer}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}>
          {this.state.day.map(day => (
            day.marker.map(marker => (
              <Marker
                coordinate={marker.latlng}
                title={marker.title}
              />
            ))
          ))}
        </MapView>
        <View style={styles.tourInfoContainer}>
          <ScrollView style={styles.dayScrollContainer} horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => this.changeDay("ALL")} style={styles.dayButtonContainer}>
              <Text>ALL</Text>
            </TouchableOpacity>
            {this.state.day.map(day => (
              <TouchableOpacity onPress={() => this.changeDay("DAY" + day.index.toString())} style={styles.dayButtonContainer}>
                <Text>{"DAY" + day.index.toString()}</Text>
              </TouchableOpacity>
            ))}

          </ScrollView>
          <View style={styles.tourInfoListContainer}>
            <Text>{this.state.title}</Text>
            <Text>{this.state.description}</Text>
            <Text>{this.state.startDay + "~" + this.state.endDay}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => this.modify()} style={[styles.bubble, styles.button]}>
                <Text>수정하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mapContainer: {
    flex: 1,
    height: "50%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  tourInfoContainer: {
    flex: 1,
    height: "50%",
    width: "100%",
  },
  dayScrollContainer: {
    flex: 1,
  },
  dayButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1
  },
  tourInfoListContainer: {
    flex: 7,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
});