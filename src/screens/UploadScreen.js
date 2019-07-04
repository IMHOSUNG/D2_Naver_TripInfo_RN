import React from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Button,
  CameraRoll,
  Image,
  Dimensions,
  ScrollView,
  PixelRatio,
  Alert
} from 'react-native'

let styles
const { width } = Dimensions.get('window')

export default class UploadScreen extends React.Component {
  static navigationOptions = {
    title: 'Camera Roll App'
  }

  state = {
    modalVisible: false,
    photos: [],
    index: null,
    latitude: null,
    longitude: null,
  }

  setIndex = (index) => {
    if (index === this.state.index) {
      index = null
    }
    this.setState({ index })
    console.log(this.state);
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then(r => this.setState({ photos: r.edges }))
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  hasLocation = () =>{
    if(this.state.photos[this.state.index].node.hasOwnProperty('location'))
      this.toggleModal();
    else 
      Alert.alert(
        '잘못된 사진 선택',
        'location 정보가 없습니다.'
      );
  }
  render() {
    console.log('state :', this.state)
    return (
      <View style={styles.container}>
        <Button
          title='View Photos'
          onPress={() => { this.toggleModal(); this.getPhotos(); }}
        />
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('closed')}
        >
          <View style={styles.modalContainer}>
            <Button
              title='Close'
              onPress={this.toggleModal()}
            />
            <Button
              title='Select'
              onPress={()=> {
                if(this.state.index!==null)
                  this.hasLocation()}}  
            />
            <ScrollView
              contentContainerStyle={styles.scrollView}>
              {
                this.state.photos.map((p, i) => {
                  return (
                    <TouchableHighlight 
                      style={{opacity: i === this.state.index ? 0.5 : 1}}
                      key={i}
                      underlayColor='transparent'
                      onPress={() => this.setIndex(i)}
                    >
                      <Image
                        style={{
                          width: width/3,
                          height: width/3
                        }}
                        source={{uri: p.node.image.uri}}
                      />
                    </TouchableHighlight>
                  )
                })
              }
            </ScrollView>
          </View>
        </Modal>
        { 
          this.state.photos != undefined &&this.state.index !== null&&this.state.photos[this.state.index].node.hasOwnProperty('location') ? (
            <View style={styles.images}>
            <Image style={styles.ImageContainer} source={{uri: this.state.photos[this.state.index].node.image.uri}} />
            <Text> latitude: {this.state.photos[this.state.index].node.location.latitude}</Text>
            <Text> longitude: {this.state.photos[this.state.index].node.location.longitude}</Text>
          </View>
          ) :(
            <Text>Select a Photo</Text>
          )
         
        }
      </View>
    )
  }
}

styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  images: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ImageContainer: {
    borderRadius: 10,
    width: 250,
    height: 250,
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#CDDC39',
    
  },
})