import React from 'react'
import { ToastAndroid, View, Text, Image, Button, Platform, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import MultiImagePicker from 'react-native-image-crop-picker'
import UserInfo from '../UserInfo'
import Config from "../Config"
import Icons from "react-native-vector-icons";
import MapView, { Marker } from 'react-native-maps';
import LoadingScreen from './LoadingScreen';
import { thisTypeAnnotation } from '@babel/types';
import CommonStyles from '../CommonStyles'
var id = 0;

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

export default class MarkerModifyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markerId : props.navigation.getParam('_id'),
      tripId: props.navigation.getParam('tripId'),
      photo: null,
      day: props.navigation.getParam('day'),        // marker
      timeStamp: props.navigation.getParam('timeStamp'),  // marker, image
      latitude: props.navigation.getParam('latitude'),   // marker, image
      longitude: props.navigation.getParam('longitude'),  // marker, image
      havelatlng: true,
      mainImage: props.navigation.getParam('mainImage'),  // marker
      mainImageId: null,
      imageList: props.navigation.getParam('imageList'),    // marker
      imageListId: [],
      title: props.navigation.getParam('title'),             // marker
      description: props.navigation.getParam('description'),  // marker
      userId: UserInfo.id,        // image
      imagepicked: false,
      modalVisible: false,
      marker: [],
      isloading : false,
    };
    console.log(this.state.imageList);
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
        if (response.hasOwnProperty('latitude')&&response.hasOwnProperty('longitude')) {
          this.setState({ 
            havelatlng: true,
            latitude: response.latitude,
            longitude: response.longitude
          });
        }
        else{
            this.setState({ 
                havelatlng: false,
            });
        }
      }
    })
  }

  /* TODO 서버에 저장된 사진의 ID를 this.state.imageList에 추가해야 함 & 사진을 여러장 업로드 한 경우 */
  mainImageUpload = () => {
    return new Promise((resolve, reject)=>{
      fetch(Config.host + "/post/img", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: createFormData(this.state.photo, {
          imgId : this.state.mainImage,
          userId: this.state.userId,
          timeStamp: this.state.timeStamp,
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        })
      })
        .then(response => response.json())
        .then(response => {
          //ToastAndroid.show('메인 이미지 업로드 성공.', ToastAndroid.SHORT);
          resolve(console.log("mainImage upload success", response));
          this.setState({ photo: null });
          this.setState({mainImage: response.imageId});
        })
        .catch(error => {
          reject(console.log("mainImage upload error", error));
        });
    })

  };

  imageListUpload = () =>{
    console.log("#############"+JSON.stringify(this.state.imageList))
    return new Promise((resolve, reject)=>{
      if(this.state.imageList===[]){
        resolve([]);
      }
      else{
        var promises = this.state.imageList.map( p =>{
          return fetch(Config.host + "/post/img", {
            method: "POST",
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
            body: createFormData(p, {
              userId: this.state.userId,
              timeStamp: this.getTimestampToDate(p.modificationDate),
            })
          })
          .then(response => response.json())
          .then(response =>{
            console.log("##imageid## " +response);
            return response.imageId;
          })
          .catch(error => {
            reject(console.log("imageList upload error", error));
            alert("Upload failed!");
          });
        })    
        Promise.all(promises).then( result => {
          this.setState({imageListId: result});
          //ToastAndroid.show('추가 이미지 업로드 성공.', ToastAndroid.SHORT);
          console.log("imageList upload success", result);
          resolve(result);
        });
      }
      
    })
  }

  markerUpload = (itemlistid) =>{
    console.log("markerUpload Start", itemlistid);
    console.log("####"+ JSON.stringify(this.state.imageList));
    fetch(Config.host + "/update/marker", {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        markerId : this.state.markerId,
        tripId: this.state.tripId,
        day: String(this.state.timeStamp).slice(0, 10),
        timeStamp: this.state.timeStamp,
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        mainImage: this.state.mainImage,
        imageList: itemlistid,
        title: this.state.title,
        description: this.state.description,
        dayList: this.state.dayList
      })
      
  }).then(response => {
    ToastAndroid.show('업로드 성공', ToastAndroid.SHORT);
    console.log("marker upload success", response);
    //alert("Upload Success!");
  })
  .catch(error => {
    console.log("upload error", error);
    alert("Upload failed!");
  })
}

  pickMultiple() {
    MultiImagePicker.openPicker({
      multiple: true,
      compressImageQuality: 0.8
    }).then(response => {
      this.setState({
        imageList: response.map(i => {
          console.log('received image', i);
          return {fileName: 'justimage',uri: i.path, width: i.width, height: i.height, type: i.mime, modificationDate: i.modificationDate};
        })
      },()=>console.log(this.state.imageList));
    }).catch(e => alert(e));
  }

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
    ()=>this.setState({
      havelatlng: true,
      latitude: this.state.marker[0].coordinate.latitude,
      longitude: this.state.marker[0].coordinate.longitude
    }));
  }
  
  getTimestampToDate = (timestamp) => {
    var date = new Date(timestamp*1000);
    var chgTimestamp = date.getFullYear().toString()
        +this.addZero(date.getMonth()+1)
        +this.addZero(date.getDate().toString())
        +this.addZero(date.getHours().toString())
        +this.addZero(date.getMinutes().toString())
        +this.addZero(date.getSeconds().toString());
    return chgTimestamp;
  }
  addZero = (data)=>{
    return (data<10) ? "0"+data : data;
  }

  componentWillUpdate(nextProps, nextState) { 
    if(this.state.isloading == true){
      async()=>{      
        await this.render();
        this.setState({isloading : false});}
    }
  } 

  render() {
    return (
      <View style={styles.container} >
        {this.state.isloading ? <LoadingScreen/> : this.renderUpload()}
      </View>
    );
  }

  renderUpload() {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} >
        {this.state.photo ? (
          <React.Fragment>
            <Image source={{ uri: this.state.photo.uri }} style={{ height: 300 }} />
          </React.Fragment>
        ) : (
            <View style={styles.imageContainer}>
              <Button title="대표사진 변경" onPress={this.handleChoosephoto} />
            </View>)
        }
        {
          this.state.imagepicked && (
            (this.state.havelatlng) ? (
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
        <TextInput style={CommonStyles.input} onChangeText={(title) => this.setState({title})} value={this.state.title} />
        <TextInput style={CommonStyles.input} onChangeText={(description) => this.setState({description})} value={this.state.description} />
        {
          this.state.imageList.length!=0 &&(
            <View style={styles.imageListView}>
               {
                this.state.imageList.map((p, i) => {
                  if(p.uri != null){
                  return (
                    <Image
                      style={{ width: 100, height: 100}}
                      source={{uri: p.uri}}
                    />
                  )
                  }
                })
              }
            </View>
          )
        }
        <TouchableOpacity style={styles.buttonContainer} onPress={()=>this.pickMultiple()}>
            <Text style={{fontSize:16}}>추가 이미지 선택</Text>
        </TouchableOpacity>
        <TouchableOpacity style={CommonStyles.buttonContainer} 
                          onPress={async()=>{
                            if(this.state.havelatlng){
                              ToastAndroid.show('이미지 업로드를 시작합니다.', ToastAndroid.SHORT);
                              await this.setState({isloading : true});
                              this.mainImageUpload()
                              .then(()=>{return this.imageListUpload();})
                              .then(itemlist=>{this.markerUpload(itemlist);this.props.navigation.pop();});
                            }else{
                              alert("메인 이미지의 위치정보가 필요합니다.");
                            }
                          } }>
          <Text style={CommonStyles.text}>확인</Text>
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
          <TouchableOpacity style={CommonStyles.buttonContainer} onPress={()=>this.toggleModal()}>
          <Text>확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={async()=>{await this.setState({marker:[]});this.toggleModal()}}>
          <Text>취소</Text>
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
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    margin: 10,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5
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
  },
  imageListView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});