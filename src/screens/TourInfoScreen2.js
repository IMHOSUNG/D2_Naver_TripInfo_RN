import { Animated, Dimensions, View, ScrollView, FlatList, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import React from "react";
import Config from "../Config";
import SlidingUpPanel from 'rn-sliding-up-panel';

const { height } = Dimensions.get("window");

const DEFAULT_PADDING = { top: 300, right: 100, bottom: 1000, left: 100 };

export default class TourInfoScreen2 extends React.Component {

  static defaultProps = {
    draggableRange: { top: height - 50, bottom: 100 }
  };

  _draggedValue = new Animated.Value(100);

  constructor(props) {
    super(props);
    this.markerFlatList = [];
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
      .then((resopnseJson) => resopnseJson.sort((a, b) => {
        if (a.timeStamp > b.timeStamp) return 1;
        else return -1;
      })
      )
      .then(async (resopnseJson) => {
        console.log(resopnseJson)
        this.setState({ markerList: resopnseJson });
        await this.initTourInfo(resopnseJson);
      })
      .catch((error) => { alert(error); });
  }

  async initTourInfo(markerList) {
    if (markerList.length != 0) {
      let dayIndex = 1;
      let currentDay = this.state.startDay;
      await Promise.all(markerList).then(markerList.map((marker, index) => {
        if (index == 0) {
          this.setState({ day: [{ index: dayIndex, marker: [marker] }] });
        }
        else if (currentDay == marker.day) {
          this.setState({
            day: this.state.day.map(dayItem =>
              dayIndex == dayItem.index ? { index: dayIndex, marker: [...dayItem.marker, marker] } : dayItem)
          })
        }
        else {
          let a = parseInt(String(marker.day).slice(8, 10), 10);
          let b = parseInt(String(currentDay).slice(8, 10), 10);
          if (a - b > 1) {
            for (let i = b + 1; i < a; i++) {
              this.setState({ day: [...this.state.day, { index: ++dayIndex, marker: [] }] });
            }
          }
          ++dayIndex;
          this.setState({ day: [...this.state.day, { index: dayIndex, marker: [marker] }] });
          currentDay = marker.day;
        }
      }));
    }
  }

  fitMarkers(markerList) {
    if (markerList.length > 0)
      this.map.fitToCoordinates(markerList, { edgePadding: DEFAULT_PADDING, animated: true });
  }

  _makeDayCard = ({ item }) => (
    <View style={styles.CardContainer}>
      <Text style={styles.CardTitle}>{"Day " + String(item.index)}</Text>
      <FlatList
        ref={(markerFlatListRef) => { this.markerFlatList[item.index - 1] = markerFlatListRef; }}
        data={item.marker}
        initialNumToRender={2}
        renderItem={this._makeMarkerCard}
        keyExtractor={(item) => item._id}
      />
    </View>
  );

  _makeMarkerCard = ({ item }) => (
    <View style={styles.CardContainer}>
      <Image source={{ uri: Config.host + "/picture/" + item.mainImage }} style={{ width: "100%", height: 300, borderRadius: 4 }} />
      <Text style={styles.CardTitle}>{item.title}</Text>
      <Text style={styles.CardContent}>{item.timeStamp}</Text>
    </View>
  );

  componentWillMount() {
    this.getMarker();
  }

  onPressDay = (dayIndex) => {
    if (this.state.markerList.length > 0) {
      if (dayIndex == "ALL") {
        this.dayFlatList.scrollToIndex({ animated: true, index: 0 });
        this.fitMarkers(this.state.markerList);
      }
      else {
        this.dayFlatList.scrollToIndex({ animated: true, index: dayIndex - 1 });
        this.state.day.map((dayItem) => {
          if (dayIndex == dayItem.index) {
            this.fitMarkers(dayItem.marker);
          }
        });
      }
    }
  }

  onPressMarker = (dayIndex, markerIndex) => {
    this.dayFlatList.scrollToIndex({ animated: true, index: dayIndex - 1 });
    // this.markerFlatList[dayIndex - 1].scrollToIndex({ animated: true, index: markerIndex });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView ref={mapRef => { this.map = mapRef; }}
          onLayout={() => this.fitMarkers(this.state.markerList)}
          style={styles.mapContainer}
          initialRegion={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: this.state.latitudeDelta,
            longitudeDelta: this.state.longitudeDelta
          }}>
          {this.state.day.map(day => (
            day.marker.map((marker, index) => (
              <Marker
                onPress={() => this.onPressMarker(day.index, index)}
                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                title={marker.title}
                description={"Day " + String(day.index)} />
            ))
          ))}
        </MapView>
        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={this.props.draggableRange}
          animatedValue={this._draggedValue}
          snappingPoints={[360]}
          height={height + 100}
          friction={0.5}
        >
          <View style={styles.panel}>
            <View style={styles.panelHeader}>
              <ScrollView style={styles.dayScrollContainer} horizontal={true} showsHorizontalScrollIndicator={false} pagingEnabled={false}>
                <TouchableOpacity onPress={() => this.onPressDay("ALL")} style={styles.dayButtonContainer}>
                  <Text>ALL</Text>
                </TouchableOpacity>
                {this.state.day.map(day => (
                  <TouchableOpacity onPress={() => this.onPressDay(day.index)} style={styles.dayButtonContainer}>
                    <Text>{"DAY" + day.index.toString()}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <FlatList
              ref={dayFlatListRef => { this.dayFlatList = dayFlatListRef; }}
              data={this.state.day}
              initialNumToRender={2}
              renderItem={this._makeDayCard}
              keyExtractor={(item) => item.index}
            />
          </View>
        </SlidingUpPanel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  dayButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    fontSize: 24,
    backgroundColor: '#fff',
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
    backgroundColor: "white",
  },
  panel: {
    flex: 1,
    backgroundColor: "rgb(248, 248, 248)",
    position: "relative",
    paddingBottom : 150,
  },
  panelHeader: {
    height: "5%",
    backgroundColor: "#fff",
    justifyContent: "flex-end",
    padding: 10
  },
  textHeader: {
    fontSize: 28,
    color: "#FFF"
  },
});