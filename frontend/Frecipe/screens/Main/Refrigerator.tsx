import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Refrigerator extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Hello, I am refrigerator!</Text>
      </View>
    );
  }
}

export default Refrigerator;