import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { db } from '../src/config';
import { WebView } from 'react-native-webview';
import COLORS from '../src/colorconfig';
import Moment from 'moment';

export default class Sponsor extends Component {

    constructor(props) {
        super(props);
        this.state = {
          dataSource: {},
          toggle: true
        };
      }

componentDidMount(){

    let date = new Date().get;
    date = Moment(date).isoWeek();

    db.database().ref('sponsors/'+date).once('value').then(function(snapshot) {

    this.setState({
        dataSource: snapshot.val()
    });
    }.bind(this));

}

render() {
    if(this.state.toggle){
        return (
            <View style={styles.container}>
                <Image style={styles.imageLogo} source={require('../assets/IO.png')}/>
                <Image style={styles.image} source={{uri: this.state.dataSource.photo}}/>
                <View style={{flexDirection:"row"}}>
                <View style={{marginRight:5, marginLeft: 5, alignItems: 'center', justifyContent: 'center'}}>
                <Text style={styles.sponsorheaders}>Sponsorer i denne uge en pulje på:</Text>
                <Text style={styles.sponsorname}>{this.state.dataSource.pot} kr.</Text>
                </View>
                </View>
                <TouchableOpacity
                style={styles.website}
                onPress={() => {this.setState({toggle:false})}}>
                <Text style={{color:COLORS.navigation}}>Besøg {this.state.dataSource.name}s hjemmeside</Text>
                </TouchableOpacity>
            </View>
          );
    }
    else{
        return(
            <View style={styles.containerWeb} >
            <TouchableOpacity onPress={() => {this.setState({toggle:true})}}>
            <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'white', fontSize: 24}}>Luk website</Text>
            </View>
            </TouchableOpacity>
            <WebView
              style={styles.WebViewStyle}
              source={{ uri: this.state.dataSource.website }}
              javaScriptEnabled={true}
              domStorageEnabled={true} />
          </View>
        );
    }
  }
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      alignItems:'center',
      bottom: 0
    },
    image: {
        height:250,
        width:'90%',
        resizeMode:'contain'
    },
    imageLogo: {
        height:100,
        width:'100%',
        resizeMode:'contain'
    },
    containerWeb: {
        flex: 1,
    },
    sponsorname:{
        marginBottom: 30,
        fontSize: 40,
        fontFamily: 'Roboto',
        color: COLORS.white,
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 2, width: 2 },
        shadowOpacity: 1,
        shadowRadius: 1
    },
    sponsorheaders:{
        marginBottom: 10,
        fontSize: 16,
        fontFamily: 'Roboto',
        color: COLORS.white,
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 2, width: 2 },
        shadowOpacity: 1,
        shadowRadius: 1
    },
    website:{
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
        fontSize: 14,
        borderColor: COLORS.navigation,
        borderWidth: 1,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    }
});
