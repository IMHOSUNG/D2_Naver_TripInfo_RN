import React from 'react'
import { View, Text, Image, Button, Platform, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import UserInfo from '../UserInfo'
import Icons from "react-native-vector-icons";
import MapView, { Marker } from 'react-native-maps';
const createFormData = (photo, body) => {
    const data = new FormData();
  
    data.append("picture", {
      name: photo.fileName,
      type: photo.type,
      uri:
        Platform.OS === "android" ? photo.uri : photo.uri.replace("file://", "")
    });
  
    Object.keys(body).forEach(key => {
      data.append(key, body[key]);
    });
  
    return data;
  };

export default class ImageUploadScreen extends React.Component {
  state = {
    photo: null,
    location: "방문지",
    content: "간단한 설명",
    latitude: null,
    longitude: null,
    imagepicked: false
  }

  handleChoosephoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response });
        this.setState({imagepicked: true})
        console.log(response);
        if(response.hasOwnProperty('latitude')){
          this.setState({latitude: response.latitude});
        }
        if(response.hasOwnProperty('longitude')){
          this.setState({longitude: response.longitude});
        }
      }
    })
  }

  
handleUploadphoto = () => {
    fetch("http://www.playinfo.co.kr/post/img", {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: createFormData(this.state.photo, {
          //userName : UserInfo.name,
          userEmail : UserInfo.email,
          //TimeStamp : 201907071826, 
          //TripId : "currentClikedTripID"
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("upload succes", response);
        alert(response.imageId);
        alert("Upload success!");
        this.setState({ photo: null });
      })
      .catch(error => {
        console.log("upload error", error);
        alert("Upload failed!");
      });
  };

  render() {
    //const { photo } = this.state.photo
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
        {this.state.photo ? (
        <React.Fragment>
          <Image
              source={{ uri: this.state.photo.uri }}
              style={{ height: 300 }}
          />
        </React.Fragment>
        ): (
        <View style={styles.imageContainer}>
          <Button title="대표사진 선택" onPress={this.handleChoosephoto}/>
        </View>)}
        {
          
          this.state.imagepicked&&(
            (this.state.latitude!==null&&this.state.longitude!==null)?(
           <Text style={styles.locationKnow}> 위치정보 확인</Text>
          ):(
           <View style={styles.locationContainer}>
            <Text style={styles.locationUnknown}> 위치정보 확인 불가</Text>
            <TouchableOpacity style={styles.buttonContainer}>
               <Text>수동 설정</Text>
            </TouchableOpacity>
           </View>
           
          ))
        }
        <TextInput style={styles.input} onChangeText={(location) => this.setState({location})} value={this.state.location} />
        <TextInput style={styles.input} onChangeText={(content) => this.setState({content})} value={this.state.content} />
        <TouchableOpacity style={styles.buttonContainer} onPress={this.handleUploadphoto} >
          <Text>확인</Text>
        </TouchableOpacity>
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
    alignItems:"center"

  },
  locationKnow: {
    color: "green"
  },
  locationUnknown: {
    color: "red"
  }
});