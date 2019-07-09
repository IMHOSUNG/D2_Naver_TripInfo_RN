import React from 'react'
import { View, Text, Image, Button, Platform } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import UserInfo from '../UserInfo'

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
  }

  handleChoosephoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response })
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
    const { photo } = this.state
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {photo && (
          <React.Fragment>
            <Image
                source={{ uri: photo.uri }}
                style={{ width: 300, height: 300 }}
            />
            <Button title="Upload" onPress={this.handleUploadphoto} />
          </React.Fragment>
        )}
        <Button title="Choose photo" onPress={this.handleChoosephoto} />
      </View>
    )
  }
}