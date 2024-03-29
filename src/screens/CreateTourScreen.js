import { ToastAndroid, ScrollView, KeyboardAvoidingView ,View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Modal, Button, Image } from "react-native";
import React, { Component } from "react";
import CalendarPicker from 'react-native-calendar-picker';
import ImagePicker from 'react-native-image-picker'
import UserInfo from "../UserInfo"
import Config from "../Config"
import LoadingScreen from './LoadingScreen';
import CommonStyles from '../CommonStyles'

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

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf())
  dat.setDate(dat.getDate() + days);
  return dat;
}

Date.prototype.simpleformat = function(){
  var dat = new Date(this.valueOf())
  var year = dat.getFullYear();
  var month = (1+ dat.getMonth());
  month  = month>=10 ? month : '0'+month;
  var day = dat.getDate();
  day = day > 10 ? day: '0'+day;
  return year + '-' + month +'-' + day; 
}
function parse(str) {
  var y = str._i.year;
  var m = str._i.month;
  var d = str._i.day;
  return new Date(y,m,d);
}



export default class CreateTourScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      userId: UserInfo.id,
      mainImage: Config.defaultImg,
      title: "title",
      description: "description",
      startDay: null,
      endDay: null,
      dayList: [],
      modifiedTime: null,
      modalVisible: false,
      photo: null,
      imagepicked: false,
      isloading : false,
    };
  }

  handleCreateTour = async() => {
    
    fetch(Config.host + "/post/trip", {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: this.state.userId,
        mainImage: this.state.mainImage,
        title: this.state.title,
        description: this.state.description,
        dayList: this.state.dayList
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("Create succes", response);
        ToastAndroid.show('생성 완료!', ToastAndroid.SHORT);
        this.setState({
          mainImage: Config.defaultImg,
          title: null,
          description: null,
          dayList: []
        });
      })
      .catch(error => {
        console.log("Create error", error);
        alert("Create failed!");
      });
  };
  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  onDateChange= (date, type) => {
    if (type === 'END_DATE') {
      this.setState({
        endDay: date,
      });
    } else {
      this.setState({
        startDay: date,
        endDay: date,
      });
    }
  };
  getDates = () => {
    var currentDate = parse(this.state.startDay);
    var endDate = parse(this.state.endDay);
    for(currentDate; currentDate<=endDate; currentDate = currentDate.addDays(1)){
      ((x)=>{
        this.setState((state)=>({dayList:state.dayList.concat(x.simpleformat())}))
      })(currentDate);
    }
  }

  handleChoosephoto = () => {
    const options = {
      noData: true,
    }
    ImagePicker.launchImageLibrary(options, response => {
      if (response.uri) {
        this.setState({ photo: response });
        this.setState({ imagepicked: true });
      }
    })
  }

  mainImageUpload = async() => {
    await this.setState({isloading : true});
    return new Promise((resolve, reject)=>{     
      fetch(Config.host + "/post/img", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: createFormData(this.state.photo, {
          userId: this.state.userId,
        })
      })
        .then(response => response.json())
        .then(response => {
          this.setState({ photo: null });
          this.setState({mainImage: response.imageId},()=> resolve(console.log("mainImage upload success", response)));
        })
        .catch(error => {
          reject(console.log("mainImage upload error", error));
        });
    })
  };

  componentWillUpdate(nextProps, nextState) {
    if (this.state.isloading == true) {
      async () => {
        await this.render();
        this.setState({ isloading: false });
      }
    }
  }


  renderUpload() {
    return (
      <ScrollView>
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        {this.state.photo ? (
          <React.Fragment>
            <Image source={{ uri: this.state.photo.uri }} style={{ height: 300 }} />
          </React.Fragment>
        ) : (
            <KeyboardAvoidingView style={styles.imageContainer}>
              <Button title="대표사진 선택" onPress={()=>this.handleChoosephoto()} />
            </KeyboardAvoidingView>)
        }
        <TextInput style={CommonStyles.input} onChangeText={(title) => this.setState({title})} value={this.state.title} />
        <TextInput style={CommonStyles.input} onChangeText={(description) => this.setState({description})} value={this.state.description} />
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.toggleModal()}>
          <Text style={{fontSize: 16}}>날짜 선택</Text>
        </TouchableOpacity>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => this.toggleModal()}>
          <KeyboardAvoidingView style={styles.modalContainer}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              todayBackgroundColor="#f2e6ff"
              selectedDayColor="#7300e6"
              selectedDayTextColor="#FFFFFF"
              onDateChange={this.onDateChange}
            />
            <TouchableOpacity style={CommonStyles.buttonContainer} 
              onPress={() => {this.setState({dayList:[]},()=>{this.getDates(); this.toggleModal()})}}>
              <Text style={CommonStyles.text}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => this.toggleModal()}>
              <Text style={{fontSize: 16}}>취소</Text>
            </TouchableOpacity>
            
          </KeyboardAvoidingView>
        </Modal>
        <Text>{this.state.dayList[0]}~{this.state.dayList[this.state.dayList.length-1]}</Text>
        <TouchableOpacity style={CommonStyles.buttonContainer} 
          onPress={() => {
            this.mainImageUpload().then(()=>{this.handleCreateTour()
              this.props.navigation.pop()});
            }}>
          <Text style={CommonStyles.text}>확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.pop()}>
          <Text style={{fontSize: 16}}>취소</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      </ScrollView>
    );
  }


render() {
  return (
    <View style={styles.container} >
      {this.state.isloading ? <LoadingScreen /> : this.renderUpload()}
    </View>
  );
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
      marginTop: 5,
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
    }
});