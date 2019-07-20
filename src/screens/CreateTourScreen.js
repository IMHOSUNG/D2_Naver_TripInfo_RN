import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform, Modal } from "react-native";
import React, { Component } from "react";
import CalendarPicker from 'react-native-calendar-picker';
import { MenuButton, Logo } from "../components/header/header";
import UserInfo from "../UserInfo"
import Config from "../Config"

Date.prototype.addDays = function(days) {
  var dat = new Date(this.valueOf())
  dat.setDate(dat.getDate() + days);
  return dat;
}

Date.prototype.simpleformat = function(){
  var dat = new Date(this.valueOf())
  var year = dat.getFullYear();
  var month = (1+ dat.getMonth());
  month  = month>10 ? month : '0'+month;
  var day = dat.getDate();
  day = day > 10 ? day: '0'+day;
  return year + '-' + month +'-' + day; 
}
function parse(str) {
  var y = str._i.year;
  var m = str._i.month;
  var d = str._i.day;
  console.log(str);
  return new Date(y,m-1,d);
}



export default class CreateTourScreen extends React.Component {
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
      userId: UserInfo.id,
      mainImage: Config.defaultImg,
      title: "title",
      description: "description",
      startDay: null,
      endDay: null,
      dayList: [],
      modifiedTime: null,
      modalVisible: false,
    };
  }

  handleCreateTour = () => {
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
        alert("Create success!");
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
        endDay: null,
      });
    }
  };
  getDates = () => {
    var currentDate = parse(this.state.startDay);
    var endDate = parse(this.state.endDay);
    var tmparr = [];
    console.log(currentDate);
    for(currentDate; currentDate<=endDate; currentDate = currentDate.addDays(1)){
      ((x)=>{
        this.setState((state)=>({dayList:state.dayList.concat(x.simpleformat())}))
      })(currentDate);
    }
}
  render() {
    return (
      <View style={styles.container}>
        <Text>Hello! Welcome to create trip page</Text>
        <TextInput style={styles.input} onChangeText={(title) => this.setState({title})} value={this.state.title} />
        <TextInput style={styles.input} onChangeText={(description) => this.setState({description})} value={this.state.description} />
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.toggleModal()}>
          <Text>날짜 선택</Text>
        </TouchableOpacity>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('closed')}>
          <View style={styles.modalContainer}>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              todayBackgroundColor="#f2e6ff"
              selectedDayColor="#7300e6"
              selectedDayTextColor="#FFFFFF"
              onDateChange={this.onDateChange}
            />
             <TouchableOpacity style={styles.buttonContainer} onPress={() => this.toggleModal()}>
              <Text>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => {this.getDates(); this.toggleModal()}}>
              <Text>확인</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <Text>{this.state.dayList[0]}~{this.state.dayList[this.state.dayList.length-1]}</Text>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.handleCreateTour()}>
          <Text>확인</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.navigation.pop()}>
          <Text>취소</Text>
        </TouchableOpacity>
      </View>
    );
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
});