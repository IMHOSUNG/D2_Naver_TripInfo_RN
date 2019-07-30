import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class SplashScreen extends React.Component {
  performTimeConsumingTask = async () => {
    return new Promise((resolve) =>
      setTimeout(() => { resolve('result') }, 1000)
    )
  }

  async componentDidMount() {
    // Preload data from an external API
    // Preload data using AsyncStorage
    const data = await this.performTimeConsumingTask();

    if (data !== null) {
      this.props.navigation.navigate('Drawer');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Gazua</Text>
        </View>
        <View>
          <Text style={styles.footer}>Powered by YIY</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2AC062',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: 'white',
    fontSize: 35,
    fontFamily: '',
    fontWeight: 'bold'
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  footer: {
    color: 'white',
    fontWeight: '200',
    paddingBottom: 5
  }
});