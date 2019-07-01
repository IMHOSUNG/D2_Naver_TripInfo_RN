import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

const Context = React.createContext()

export default class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._logOutAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _logOutAsync = async() => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  }

  // Render any loading content that you like here
  render() {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  }
})


