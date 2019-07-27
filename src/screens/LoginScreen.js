import React, { Component } from 'react';
import { View, Text, Alert, Platform, AsyncStorage,} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import NativeButton from 'apsl-react-native-button';
import { NaverLogin, getProfile } from 'react-native-naver-login';
import UserInfo from '../UserInfo';
import Config from '../Config';

const initials = {
  kConsumerKey: 'kviDlRsy8Sr2McA8ijUd',
  kConsumerSecret: '20rlgtzoDL',
  kServiceAppName: 'D2NaverTripInfo',
  kServiceAppUrlScheme: 'D2NaverTripInfo', // only for iOS
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNaverLoggingin: false,
      theToken: 'token has not fetched',
    };
  }

  async _signInAsync(response){
    UserInfo.email = response.email;
    UserInfo.name = response.name;
    UserInfo.id = response.id;
    UserInfo.nickname = response.nickname;
    
    //console.log(Config.host + "/post/user");
    await fetch(Config.host + "/post/user", {
      method: "POST",
      headers: {
        'Accept' : 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: response.id,
        userEmail: response.email,
        name: response.name,
        nickname: response.nickname,
      })
    })
      .then(response => response.json())
      .then(response => {
        console.log("user Create success", response);
      })
      .catch(error => {
        console.log("Create error", error);
      });

    await AsyncStorage.setItem('email', response.email);
    await AsyncStorage.setItem('name', response.name);
    await AsyncStorage.setItem('id', response.id);
    await AsyncStorage.setItem('nickname', response.nickname);
  };


  // 로그인 후 내 프로필 가져오기.
  async fetchProfile() {
    const profileResult = await getProfile(this.state.theToken);
    console.log(this.state.theToken);
    console.log('profile');
    console.log(profileResult);
    
    if (profileResult.resultcode === '024') {
      Alert.alert('로그인 실패', profileResult.message);
      return;
    }
    this._signInAsync(profileResult.response);
    
    console.log('email ' + profileResult.response.email);
    //result.profile = profileResult;

    this.props.navigation.navigate('App', profileResult);
  }

  // 네이버 로그인 시작.
  async naverLoginStart() {
    console.log('  naverLoginStart  ed');
    NaverLogin.login(initials, (err, token) => {
      console.log(`\n\n  Token is fetched  :: ${token} \n\n`);
      this.setState({ theToken: token });
      if (err) {
        console.log(err);
        return;
      }
      this.fetchProfile();
    });
  }

  render() {
    const { theToken } = this.state;
    return (
      <View style={ styles.container }>
        <View style={ styles.content }>
          <NativeButton
            isLoading={this.state.isNaverLoggingin}
            onPress={() => this.naverLoginStart()}
            activeOpacity={0.5}
            style={styles.btnNaverLogin}
            textStyle={styles.txtNaverLogin}
          >NAVER LOGIN</NativeButton>

        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginTop: Platform.OS === 'ios' ? 0 : '$statusSize',
    paddingTop: Platform.OS === 'ios' ? '$statusPaddingSize' : 0,
    backgroundColor: 'white',
  },
  header: {
    flex: 8.8,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 87.5,
    flexDirection: 'column',
    justifyContent: 'center',
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  title: {
    fontSize: '$24',
    fontWeight: 'bold',
  },
  btnNaverLogin: {
    height: '$48',
    width: '240 * $ratio',
    alignSelf: 'center',
    backgroundColor: '#00c40f',
    borderRadius: 0,
    borderWidth: 0,
  },
  txtNaverLogin: {
    fontSize: '$fontSize',
    color: 'white',
  },
});

export default LoginScreen;