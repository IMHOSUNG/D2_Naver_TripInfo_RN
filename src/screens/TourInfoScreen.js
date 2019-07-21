import { View, ScrollView, FlatList, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import Config from "../Config"

const DEFAULT_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };

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
      tripId: props.navigation.getParam('_id'),
      title: props.navigation.getParam('title'),
      description: props.navigation.getParam('description'),
      dayList: props.navigation.getParam('dayList'),
      startDay: props.navigation.getParam('dayList')[0],
      endDay: props.navigation.getParam('dayList')[props.navigation.getParam('dayList').length - 1],
      latitude: 37.550462,    // default latitude
      longitude: 126.994100,  // default longitude
      latitudeDelta: 0.05,    // default latitudeDelta
      longitudeDelta: 0.05,   // default longitudeDelta
      markerList: [],
      day: []
    };
  }

  addNewDay = (marker, index) => {
    this.state.day = this.state.day.concat({ index: index, marker: [marker] });
  }

  updateMarker = (marker, index) => {
    this.setState({
      day: this.state.day.map(dayItem =>
        index == dayItem.index ? { index: index, marker: [...dayItem.marker, marker] } : dayItem)
    }, () => console.log(this.state.day));
  }

  getMarker = () => {
    fetch(Config.host + '/get/marker/' + this.state.tripId)
      .then((resopnse) => resopnse.json())
      //.then((resopnseJson) => { resopnseJson.sort((a, b) => a.timeStamp < b.timeStamp); })
      .then((resopnseJson) => this.setState({ markerList: [...this.state.markerList, ...resopnseJson] }, 
        () => this.initTourInfo(), 
        () => this.fitAllMarkers()))
      .catch((error) => { alert(error); });
  }

  initTourInfo() {
    if (this.state.markerList.length == 0) {
      ;
    } else {
      var index = 1;
      var currentDay = this.state.startDay;
      this.state.markerList.map((marker) => {
        if (currentDay == marker.day) {
          this.updateMarker(marker, index);
        } else {
          index++;
          this.addNewDay(marker, index);
          currentDay = marker.day
        }
      }, () => { })
    }
  }

  fitAllMarkers() {
    this.map.fitToCoordinates(this.state.markerList, {
      edgePadding: DEFAULT_PADDING,
      animated: true,
    });
  }

  _onPress(item) {
    
  }

  _makeCard = ({ item }) => (
    <View style={styles.CardContainer}>
      <TouchableOpacity onPress={() => this._onPress(item)}>
        <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
        <Text style={styles.CardTitle}>{item.title}</Text>
        <Text style={styles.CardContent}>{item.timeStamp}</Text>
      </TouchableOpacity>
    </View>
  );

  componentWillMount() {
    this.getMarker();
  }

  changeDay = (day) => {
    alert(day);
  }

  showMarkerInfo = (marker) => {

  }

  modifyTour() {
    const { tripId, title, description, dayList } = this.state;
    this.props.navigation.navigate('TourModify', { tripId: tripId, title: title, description: description, dayList: dayList });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView ref={ref => { this.map = ref; }}
          style={styles.mapContainer}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}>
          {this.state.day.map(day => (
            day.marker.map(marker => (
              <Marker coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} title={marker.title} />
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
          <FlatList
            data={this.state.markerList}
            initialNumToRender={2}
            renderItem={this._makeCard}
            keyExtractor={(item) => item._id}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => this.modifyTour()} style={[styles.bubble, styles.button]}>
              <Text>수정하기</Text>
            </TouchableOpacity>
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