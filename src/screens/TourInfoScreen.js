import { Animated,Dimensions ,Button, View, ScrollView, FlatList, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import React, { Component } from "react";
import { MenuButton, Logo } from "../components/header/header";
import Config from "../Config";
import SlidingUpPanel from 'rn-sliding-up-panel';

const { height } = Dimensions.get("window");

const DEFAULT_PADDING = { top: 300, right: 100, bottom: 1000, left: 100 };

export default class TourInfoScreen extends React.Component {

  static defaultProps = {
    draggableRange: { top: height + 180 - 64, bottom: 180 }
  };

  _draggedValue = new Animated.Value(100);


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

  getMarker = () => {
    fetch(Config.host + '/get/marker/' + this.state.tripId)
      .then((resopnse) => resopnse.json())
      // .then((resopnseJson) => { resopnseJson.sort((a, b) => a.timeStamp < b.timeStamp); })
      .then(async (resopnseJson) => {
        this.setState({ markerList: resopnseJson });
        await this.initTourInfo(resopnseJson);
      })
      .catch((error) => { alert(error); });
  }
  
  async initTourInfo(markerList) {
    if (markerList.length != 0) {
      let index = 1;
      let currentDay = this.state.startDay;
      await Promise.all(markerList).then(markerList.map(marker => {
        if (this.state.day.length == 0) {
          this.setState({ day: [{ index: index, marker: [marker] }] });
        }
        else if (currentDay == marker.day) {
          this.setState({
            day: this.state.day.map(dayItem =>
              index == dayItem.index ? { index: index, marker: [...dayItem.marker, marker] } : dayItem)
          })
        }
        else {
          let a = parseInt(String(marker.day).slice(8, 10), 10);
          let b = parseInt(String(currentDay).slice(8, 10), 10);
          index += a - b;
          this.setState({ day: [ ...this.state.day, { index: index, marker: [marker] }] });
          currentDay = marker.day;
        }
      }));
    }
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
    const { top, bottom } = this.props.draggableRange;
    const backgoundOpacity = this._draggedValue.interpolate({
      inputRange: [height - 48, height],
      outputRange: [1, 0],
      extrapolate: "clamp"
    });
    const iconTranslateY = this._draggedValue.interpolate({
      inputRange: [height - 56, height, top],
      outputRange: [0, 56, 180 - 32],
      extrapolate: "clamp"
    });
    const textTranslateY = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, 8],
      extrapolate: "clamp"
    });
    const textTranslateX = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [0, -112],
      extrapolate: "clamp"
    });
    const textScale = this._draggedValue.interpolate({
      inputRange: [bottom, top],
      outputRange: [1, 0.7],
      extrapolate: "clamp"
    });

    return (
      <View style={styles.container}>
        <MapView ref={ref => { this.map = ref; }}
          onLayout={() => this.map.fitToCoordinates(this.state.markerList, { edgePadding: DEFAULT_PADDING, animated: true })}
          style={styles.mapContainer}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}>
          {this.state.day.map(day => (
            day.marker.map(marker => (
              <Marker coordinate={{ latitude: marker.latitude, longitude: marker.longitude }} title={marker.title} description={String(day.index)} />
            ))
          ))}
        </MapView>
        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={this.props.draggableRange}
          animatedValue={this._draggedValue}
          snappingPoints={[360]}
          height={height + 180}
          friction={0.5}
        >
          <View style={styles.panel}>
            <Animated.View
              style={[
                styles.iconBg,
                {
                  opacity: backgoundOpacity,
                  transform: [{ translateY: iconTranslateY }]
                }
              ]}
            />
            <View style={styles.panelHeader}>
              <Animated.View
                style={{
                  transform: [
                    { translateY: textTranslateY },
                    { translateX: textTranslateX },
                    { scale: textScale }
                  ]
                }}
              >
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  <TouchableOpacity onPress={() => this.changeDay("ALL")} style={styles.dayButtonContainer}>
                    <Text>ALL</Text>
                  </TouchableOpacity>
                  {this.state.day.map(day => (
                    <TouchableOpacity onPress={() => this.changeDay("DAY" + day.index.toString())} style={styles.dayButtonContainer}>
                      <Text>{"DAY" + day.index.toString()}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Animated.View>
            </View>
            <ScrollView>
              <TouchableOpacity onPress={() => this.modifyTour()} style={[styles.bubble, styles.button]}>
                <Text>수정하기</Text>
              </TouchableOpacity>
            </ScrollView>
            <FlatList
              data={this.state.markerList}
              initialNumToRender={2}
              renderItem={this._makeCard}
              keyExtractor={(item) => item._id}
            />

          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: "100%",
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
  panel: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
    paddingBottom : "10%",
  },
  panelHeader: {
    height: "10%",
    backgroundColor: "#b197fc",
    justifyContent: "flex-end",
    padding: 24
  },
  textHeader: {
    fontSize: 28,
    color: "#FFF"
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    zIndex: 1
  },
  iconBg: {
    backgroundColor: "#2b8a3e",
    position: "absolute",
    top: -24,
    right: 18,
    width: 48,
    height: 48,
    borderRadius: 24,
    zIndex: 1
  }
});