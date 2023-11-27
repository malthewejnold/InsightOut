import * as React from 'react';
import { Text, View, ActivityIndicator, StyleSheet, Image, Button, Linking, TouchableOpacity } from 'react-native';
import { db } from '../src/config';
import COLORS from '../src/colorconfig';

let dataCount = 0;
let randomNumber = 0;

export default class RandView extends React.Component {
  state = {
    dataSource: null,
    isLoading: true,
    error: null,
    randomPlace: {}
  };

  componentDidMount = () => {

    db.database().ref('results').once('value').then(function(result) {

      dataCount = result.val().length;

      randomNumber = Math.floor(Math.random() * dataCount-1);

      console.log(randomNumber);

      db.database().ref('results/'+randomNumber).once('value').then(snapshot =>
        {
            var place = snapshot.val();

            this.setState({
              randomPlace: place,
              isLoading: false
          });
      });
    }.bind(this));
  };

  sendEmail = () => {
    // Her benyttes en string template til at lave en gyldig email-url
    const emailUrl = `mailto:${this.state.randomPlace.email}`;
    Linking.openURL(emailUrl);
  };

  callNumber = () => {
    const phoneUrl = `tel:${this.state.randomPlace.phone}`;
    Linking.openURL(phoneUrl);
  };

  render() {
    const { isLoading, randomPlace } = this.state;

    if(isLoading==true){
      return (
        <View style={{flex:1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator/>
        </View>
      );
    }else{
      return (
        <View style={styles.container}>
          <Text style={styles.header}>
            {randomPlace.name}
          </Text>
          <Text style={styles.descriptiontext}>
            {randomPlace.description}
          </Text>
          <Text style={styles.contacttext}>Telefon nr.:</Text>
          <TouchableOpacity
          style={styles.sendemail}
          onPress={this.callNumber}
          >
          <Text style={{color:COLORS.white}}>{randomPlace.phone}</Text>
          </TouchableOpacity>
          <Text style={styles.contacttext}>
            {randomPlace.location.street.name} {randomPlace.location.street.number}
          </Text>
          <TouchableOpacity
          style={styles.sendemail}
          onPress={this.sendEmail}>
          <Text style={{color:COLORS.white}}>Send mail</Text>
          </TouchableOpacity>
        </View>
      );
     }
  }
}

const styles = StyleSheet.create({
  // Man skal altid angive størrelsen på billeeder som loades fra netværk
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
  },
  container: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
    fontSize: 40,
    fontFamily: 'Roboto',
    color: COLORS.white,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  sendemail:{
      alignItems: 'center',
      backgroundColor: COLORS.navigation,
      padding: 10,
      marginTop: 20,
      borderRadius: 10,
      fontSize: 14,
      borderColor: COLORS.background,
      borderWidth: 1,
      shadowColor: 'rgba(0,0,0, .4)', // IOS
      shadowOffset: { height: 2, width: 2 }, // IOS
      shadowOpacity: 1, // IOS
      shadowRadius: 1, //IOS
  },
  contacttext:{
    marginTop: 30,
    fontSize: 16,
    fontFamily: 'Roboto',
    color: COLORS.white,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  descriptiontext:{
    marginBottom: 30,
    fontSize: 12,
    fontFamily: 'Roboto',
    color: COLORS.white
  }
});
