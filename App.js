import React, {Component} from 'react';
import AppContainer from './src/navigators/drawer-navigator';

console.disableYellowBox = true;

export default class App extends React.Component {
  
  render() {
    return (<AppContainer/>);
  }
}

