import { Image, View, Text, StyleSheet, AsyncStorage, TouchableOpacity, PixelRatio, Modal, } from "react-native";
import React, { Component } from "react";
import ImagePicker from 'react-native-image-picker'
import UserInfo from "../UserInfo";
import Config from "../Config";
const createFormData = (photo, body) => {
  const data = new FormData();

  data.append("picture", {
    name: photo.fileName,
    type: photo.type,
    uri:  photo.uri
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  return data;
};
export default class SettingsScreen extends React.Component {
  constructor(props) {
		super(props);
		this.state = { 
      profileImg: null,
      visable : false,
      photo: null,
      imagepicked: false,
    }
	}
  getProfileImg = () =>{
    fetch(Config.host + '/get/user/'+UserInfo.id)
      .then(response => response.json())
      .then(responseJson => {console.log(responseJson);this.setState({profileImg: responseJson[0].profileImg})})
      .catch(error => {
        console.log(error);
      })
  }
  toggleModal = () =>{
    this.setState({visable : !this.state.visable});
  }
  handleChoosephoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response, imagepicked: true }, ()=>this.uploadProfileImg());
      }
    })
  }
  uploadProfileImg = () =>{
    console.log("photo: "+this.state.photo);
    fetch(Config.host +'/post/img/',{
      method:"POST",
      headers:{
        'Accept' : 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: createFormData(this.state.photo, {
        userId: UserInfo.id
      })
    })
    .then(response => response.json())
    .then(response => {
      console.log("profile img upload success", response.imageId);
      return this.setState({ photo: null, profileImg: response.imageId },
        ()=>this.updateProfileImg(response.imageId));
    }).catch(err =>{
      console.log("upload failed: "+err);
    })
  }
  updateProfileImg = (prof_id) =>{
    console.log('id: '+prof_id);
    fetch(Config.host +'/update/user/profileImg/',{
      method:"POST",
      headers:{
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: UserInfo.id,
        imgId: prof_id
      })
    }).then(response => {
      console.log("profileimg update success", response);
      this.setState({ photo: null });
      return  this.getProfileImg();
    })
  }
  
  componentDidMount(){
    this.getProfileImg();
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={()=>this.toggleModal()}>
          <Image style={styles.profileImg} source={{uri:Config.host+'/picture/'+this.state.profileImg}}/>
        </TouchableOpacity>
        <Text>ID: {UserInfo.id}</Text>
        <Text>Email: {UserInfo.email}</Text>
        <Text>Name: {UserInfo.name}</Text>
        <Text>Nickname: {UserInfo.nickname}</Text>

        <TouchableOpacity style={styles.buttonContainer} onPress={() => this._logOutAsync()}>
          <Text style={styles.text}>로그아웃</Text>
        </TouchableOpacity>

        <Modal 
          transparent={true} animationType={"fade"} 
          onRequestClose={()=>this.toggleModal()} visible={this.state.visable}>
          <View style={styles.modal}>
            <View style={styles.modalcontainer}>
             <TouchableOpacity style={styles.popupMenu} onPress={()=>{this.toggleModal(); this.handleChoosephoto();}}>
                <Text>프로필 사진 변경</Text>
              </TouchableOpacity> 
              <TouchableOpacity style={styles.popupMenu} onPress={()=>{this.toggleModal(); this.updateProfileImg('5d3d5fb221dd603a1f0d3a1a')}}>
                <Text>기본 값으로 변경</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.toggleModal()}>
                <Text style={styles.text}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </Modal>
      </View>
    );
  }

  _logOutAsync = async() => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('LogOut');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    backgroundColor: "#F8F8F8"
  },
  buttonContainer: {
    display: 'flex',
    height: 50,
    width: '90%',
    margin: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2AC062',
    shadowColor: '#2AC062',
    shadowOpacity: 0.4,
    shadowOffset: { height: 10, width: 0 },
    shadowRadius: 20,
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  profileImg: {
    height: 300,
    width : 300,
    borderRadius: 3000/PixelRatio.get(),
  },
  modal: {
    flex:1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10
  },
  modalcontainer : {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10
  },
  popupMenu: {
    borderColor:'#eee',
    borderBottomWidth:0.5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
		height: 40, 
  }
});
