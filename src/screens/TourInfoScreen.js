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
      id: props.navigation.getParam('_id'),
      content: props.navigation.getParam('content'),
      startTime: props.navigation.getParam('startTime'),
      endTime: props.navigation.getParam('endTime'),
      latitude: 37.550462,
      longitude: 126.994100,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
      day: []
    };
  }

  initTourInfo() {
    // 아직 여행일지 작성이 안 된 경우
    if (false) {
      this.setState({
        marker: [
          {
            latlng: { latitude: 37.550462, longitude: 126.994100 },
            title: "title",
          }
        ]
      })
    }
    // 작성 중인 여행일지인 경우
    else {
      this.setState({
        day: [
          {
            index: 1,
            marker: [
              {
                latlng: { latitude: 37.550462, longitude: 126.994100 },
                title: "title1-1",
              },
              {
                latlng: { latitude: 37.6, longitude: 126.995100 },
                title: "title1-2",
              },
            ]
          },
          {
            index: 2,
            marker: [
              {
                latlng: { latitude: 37.6, longitude: 126.994100 },
                title: "title2-1",
              },
              {
                latlng: { latitude: 37.550462, longitude: 126.995100 },
                title: "title2-2",
              },
            ]
          }
        ]
      })
    }
  }

  changeDay = (day) => {
    alert(day);
  }

  modify() {
    this.props.navigation.navigate('TourModify',this.props);
  }

  componentDidMount() {
    this.initTourInfo()
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
          <ScrollView
            style={styles.dayScrollContainer}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
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
            <Text>{this.state.content}</Text>
            <Text>{this.state.startTime + "~" + this.state.endTime}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => this.modify()}
                style={[styles.bubble, styles.button]}
              >
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