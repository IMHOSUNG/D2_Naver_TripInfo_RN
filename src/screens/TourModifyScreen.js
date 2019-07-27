import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import React, { Component } from "react";

export default class TourModifyScreen extends React.Component {


    constructor(props) {
        super(props)
        this.state = {
            tripId: props.navigation.getParam('tripId'),
            title: props.navigation.getParam('title'),
            description: props.navigation.getParam('description'),
            dayList: props.navigation.getParam('dayList'),
            startDay: props.navigation.getParam('dayList')[0],
            endDay: props.navigation.getParam('dayList')[props.navigation.getParam('dayList').length - 1],
            latitude: 37.550462,    // default latitude
            longitude: 126.994100,  // default longitude
            latitudeDelta: 0.05,    // default latitudeDelta
            longitudeDelta: 0.05,   // default longitudeDelta
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

    add() {
        const { tripId, title, description, dayList } = this.state;
        this.props.navigation.navigate('Upload', { tripId: tripId, title: title, description: description, dayList: dayList });
    }

    remove() {

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
                        day.marker.map(marker => (<Marker coordinate={marker.latlng} title={marker.title} />))
                    ))}

                </MapView>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.add()} style={[styles.bubble, styles.button]}>
                        <Text>추가하기</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    bubble: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        backgroundColor: 'transparent',
    }
});