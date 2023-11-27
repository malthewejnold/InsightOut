import * as React from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default class Waiting extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.paragraph}>
          Check lige den seje skater, mens vi finder de fedeste steder frem til dig
        </Text>
        <Image style={styles.logo} source={require('../assets/waiting.gif')} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  paragraph: {
    margin: 24,
    marginTop: 0,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    height: 228,
    width: 228,
  }
});
