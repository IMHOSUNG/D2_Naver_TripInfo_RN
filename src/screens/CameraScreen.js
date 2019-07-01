

'use strict';
import React, { PureComponent } from 'react';
import { ToastAndroid ,PermissionsAndroid ,AppRegistry, StyleSheet, Text, TouchableOpacity, View, Alert, CameraRoll } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { MenuButton, Logo } from "../components/header/header";
import { withNavigationFocus } from "react-navigation"

const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  );
  
class CameraScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        
        return {
            headerLeft: <MenuButton onPress={() => navigation.openDrawer()} />,
            headerTitle: <Logo />,
            headerBackTitle: "Camera",
            headerLayoutPreset: "center"
        };
    };

    renderCamera() {
            const isFocused = this.props.navigation.isFocused();
            
            if (!isFocused) {
                return null;
            } else if (isFocused) {
                return (
                <RNCamera
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    
                    androidCameraPermissionOptions={{
                      title: 'Permission to use camera',
                      message: 'We need your permission to use your camera',
                      buttonPositive: 'Ok',
                      buttonNegative: 'Cancel',
                    }}
                    androidRecordAudioPermissionOptions={{
                      title: 'Permission to use audio recording',
                      message: 'We need your permission to use your audio',
                      buttonPositive: 'Ok',
                      buttonNegative: 'Cancel',
                    }}
                  >
                        {({ camera, status, recordAudioPermissionStatus }) => {
                            if (status !== 'READY') return <PendingView />;
                            return (
                            <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity onPress={() => this._takePicture(camera)} style={styles.capture}>
                                <Text style={{ fontSize: 14 }}> SNAP </Text>
                                </TouchableOpacity>
                            </View>
                            );
                        }}
                  </RNCamera>
                )
            }
    }


  render() {
    return (
      <View style={styles.container}>
          {this.renderCamera()}
      </View>
    );
  }

  _requestGPSPermission = async(camera) => {
    try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show('GPS Access', ToastAndroid.LONG); 
          this._takePicture(camera);
        } else {
          
        }
      } catch (err) {
        console.warn(err)
      }
  }

  _takePicture = async(camera) => {
    const options = { quality: 0.5, base64: true, fixOrientation : true };
    const data = await camera.takePictureAsync(options);
    // 사진이 임시로 저장되는 위치 로그
    this._requestSavePermission(data);
  };

  _requestSavePermission = async(data) => {
    try {
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
        if (granted) {
            
            this._savePicutre(data);
            ToastAndroid.show('Save Success', ToastAndroid.LONG);

        } else {
            ToastAndroid.show('Save Fail', ToastAndroid.LONG);
        }
      } catch (err) {
        console.warn(err);
      }
  }
    

  _savePicutre = async(data) => {
    await CameraRoll.saveToCameraRoll(data.uri,'photo');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default withNavigationFocus(CameraScreen);