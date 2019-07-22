import React from 'react'
import { View, Text, Image, Button, Platform, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import UserInfo from '../UserInfo'
import Config from "../Config"
import Icons from "react-native-vector-icons";
import MapView, { Marker } from 'react-native-maps';
var id=0;
const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("picture", {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};

export default class ImageUploadScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tripId: props.navigation.getParam('tripId'),
      photo: null,
      day: null,        // marker
      timeStamp: null,  // marker, image
      latitude: null,   // marker, image
      longitude: null,  // marker, image
      mainImage: null,  // marker
      imageList: [],    // marker
      title: "방문지",             // marker
      description: "간단한 설명",  // marker
      userId: UserInfo.id,        // image
      imagepicked: false,
      modalVisible: false,
      marker: []
    };
  }

  handleChoosephoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response });
        this.setState({ imagepicked: true });
        this.setState({timeStamp: response.timestamp});
        console.log(response);
        if (response.hasOwnProperty('latitude')) {
          this.setState({ latitude: response.latitude });
        }
        if (response.hasOwnProperty('longitude')) {
          this.setState({ longitude: response.longitude });
        }
      }
    })
  }

  /* TODO 서버에 저장된 사진의 ID를 this.state.imageList에 추가해야 함 & 사진을 여러장 업로드 한 경우 */
  handleUploadphoto = () => {
    fetch(Config.host + "/post/img", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: createFormData(this.state.photo, {
        userId: this.state.userId,
        timeStamp: this.state.timeStamp,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload succes", response);
        alert(response.imageId);
        alert("Upload success!");
        this.setState({ photo: null });

        fetch(Config.host + "/post/marker", {
          method: "POST",
          headers: {
            'Accept' : 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            tripId: this.state.tripId,
            day: this.state.day,
            timeStamp: this.state.timeStamp,
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            mainImage: response.imageId,
            imageList: this.state.imageList,
            title: this.state.title,
            description: this.state.description,
            dayList: this.state.dayList
          })
        });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
      });
  };

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  onMapPress = (e) => {
    this.setState({
      marker:
        [{
          coordinate: e.nativeEvent.coordinate,
          key: `foo${id++}`,
        }]
    },
    ()=>this.setState(
      {latitude: this.state.marker[0].coordinate.latitude,
       longitude: this.state.marker[0].coordinate.longitude }));
  }
  
  render() {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
        {this.state.photo ? (
          <React.Fragment>
            <Image source={{ uri: this.state.photo.uri }} style={{ height: 300 }} />
          </React.Fragment>
        ) : (
            <View style={styles.imageContainer}>
              <Button title="대표사진 선택" onPress={this.handleChoosephoto} />
            </View>)}
        {
          this.state.imagepicked && (
            (this.state.latitude !== null && this.state.longitude !== null) ? (
              <Text style={styles.locationKnow}> 위치정보 확인</Text>
            ) : (
                <View style={styles.locationContainer}>
                  <Text style={styles.locationUnknown}> 위치정보 확인 불가</Text>
                  <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.toggleModal()}>
                    <Text>수동 설정</Text>
                  </TouchableOpacity>
                </View>
              ))
        }
        <TextInput style={styles.input} onChangeText={(title) => this.setState({title})} value={this.state.title} />
        <TextInput style={styles.input} onChangeText={(description) => this.setState({description})} value={this.state.description} />
        <TouchableOpacity style={styles.buttonContainer} onPress={this.handleUploadphoto}>
          <Text>확인</Text>
        </TouchableOpacity>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('closed')}
        >
          <MapView style={styles.modalContainer}
            initialRegion={{
              latitude: 37.550462,
              longitude: 126.994100,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            onPress={e => this.onMapPress(e)}>
            {this.state.marker.map(marker => (
              <Marker
                coordinate={marker.coordinate}
                key={marker.key}
              />
            ))}
          </MapView>
          <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.toggleModal()}>
          <Text>확인</Text>
        </TouchableOpacity>
        </Modal>

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    height: 40,
    margin: 10,
    borderColor: 'gray',
    borderWidth: 1
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'gray',
    borderRadius: 5,
    borderWidth: 3,
    borderStyle: 'dashed'
  },
  mapContainer: {
    height: "50%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"

  },
  locationKnow: {
    color: "green"
  },
  locationUnknown: {
    color: "red"
  },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  }
});