import * as React from 'react';
import { View, Text, Image, StyleSheet, Button, Linking, AppRegistry } from 'react-native';
import { WebView } from 'react-native-webview';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
import COLORS from '../src/colorconfig';
import { db } from '../src/config';
import Moment from 'moment';
import Icon from '@expo/vector-icons/Ionicons';
import WebIcon from '@expo/vector-icons/MaterialCommunityIcons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

console.disableYellowBox = true;

export default class ListDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggle: true,
      currentuser: {},
      dataSource: {},
      markers: [],
      region: {}
    };
  }

  componentDidMount(){
    let date = new Date().get;
    date = Moment(date).isoWeek();
    const place = this.props.navigation.getParam('place');

    this.setState({
      currentuser: this.props.screenProps.currentUser,
      markers: [
        {
          coordinate: {
            latitude: place.location.coordinates.latitude,
            longitude: place.location.coordinates.longitude
          },
          title: place.name
        }
      ],
      region: {
        latitude: place.location.coordinates.latitude,
        longitude: place.location.coordinates.longitude,
        latitudeDelta: 0.0622,
        longitudeDelta: 0.0221,
      }
    })


    db.database().ref('sponsors/'+date).once('value').then(function(snapshot) {

      this.setState({
          dataSource: snapshot.val()
      });
      }.bind(this));
    
  }

  sendEmail = () => {
    const place = this.props.navigation.getParam('place');
    console.log(place)

    const emailUrl = `mailto:${place.email}`;
    Linking.openURL(emailUrl);
  };

  callNumber = () => {
    const place = this.props.navigation.getParam('place');
    const phoneUrl = `tel:${place.phone}`;
    Linking.openURL(phoneUrl);
  };

  checkin = () => {
    const place = this.props.navigation.getParam('place');
    let date = new Date().get;
    date = Moment(date).isoWeek();


    if(place.distanceAway>0.06){
      console.log("du er for langt væk")
    }else{
      //Lav database kald til checkins
      const useruid = this.state.currentuser.uid

      const checkinsUpdate = Number(this.state.currentuser.checkins) + 1;

      const weekcheckinsUpdate = Number(this.state.dataSource.weekcheckins) + 1;

      const amountearnedUpdate = (checkinsUpdate/weekcheckinsUpdate)*Number(this.state.dataSource.pot);

      fburl = 'users/'+useruid;
      db.database().ref(fburl).update({ 
        checkins: checkinsUpdate,
        lastcheckin: place.key,
        amountearned: amountearnedUpdate
      });

      fburl = 'sponsors/'+date;
      db.database().ref(fburl).update({ 
        weekcheckins: weekcheckinsUpdate
      });

      this.props.screenProps.updateUser(checkinsUpdate, place.key, amountearnedUpdate);
    }
  }

  renderCheckinbutton(){
    const place = this.props.navigation.getParam('place');
    const currentuser = this.state.currentuser;

    if(place.distanceAway>0.06){
      return(
        <View style={styles.buttonView}>
        <TouchableOpacity
        style={styles.checkinbutton}
        onPress={this.checkin}>
        <Text style={{color:COLORS.lightgray}}>Du er for langt væk til at kunne checke ind</Text>
        </TouchableOpacity>
        </View>
      );
    }else{
      if(Number(this.state.currentuser.lastcheckin)==Number(place.key)){
        return(
          <View style={styles.buttonView}>
          <TouchableOpacity
          style={styles.checkinbutton}>
          <Text style={{color:COLORS.lightgray}}>Du skal checke in et nyt sted før du kan checke in her igen</Text>
          </TouchableOpacity>
          </View>
        );
      }else{
        return(
          <View style={styles.buttonView}>
          <TouchableOpacity
          style={styles.checkinbutton}
          onPress={this.checkin}>
          <Text style={{color:COLORS.navigation}}>Check in</Text>
          </TouchableOpacity>
          </View>
        );
      }
    }

  }

  render() {

    // Her henter vi user ud fra navigationens parametre
    const place = this.props.navigation.getParam('place');
    // Og viser en fejlbesked hvis user ikke er defineret
    if (!place) {
      return <Text>No place specified in navigation params</Text>;
    }
    if(this.state.toggle){
      return (
        <View style={styles.container}>
            <MapView 
            provider="google"
            showsUserLocation={true}
            region={this.state.region}
            extraData={this.state}
            style={styles.location}
            // onLongPress={this.handleLongPress}
            >
            {this.state.markers.map((marker)=>{
            return (
            <Marker
            key={marker.title}
            {...marker}
            >
            <View style={styles.marker}>
            <Icon name="ios-information-circle" color="orange" size={30}/> 
            </View>
            </Marker>
            )
            })}  
            </MapView>
            <Text style={styles.address}>{place.location.street.name}, {place.location.street.number}</Text>
          {/* <Image style={styles.image} source={{ uri: place.picture.large }} /> */}
          <Text style={styles.header}>
            {place.name}
          </Text>
          <View style={styles.contactview}>
          <View style={styles.contactbox}>
          <Icon style={{ alignSelf: 'center', color: COLORS.white }} onPress={() => this.callNumber()} name="ios-call" size={30} />
          </View>
          <View style={styles.contactbox}>
          <Icon style={{ alignSelf: 'center', color: COLORS.white }} onPress={() => this.sendEmail()} name="ios-mail" size={30} />
          </View>
          <View style={styles.contactbox}>
          <WebIcon style={{ alignSelf: 'center', color: COLORS.white }} onPress={() => {this.setState({toggle:false})}} name="web" size={30} />
          </View>
          </View>
          <Text style={styles.description}>{place.description}</Text>
          {this.renderCheckinbutton()}
        </View>
      );
    }else{
      return (
        <View style={styles.containerWeb} >
          <TouchableOpacity onPress={() => {this.setState({toggle:true})}}>
            <View style={{width:'100%', alignItems:'center', justifyContent:'center'}}>
            <Text style={{color:'white', fontSize: 24}}>Luk website</Text>
            </View>
            </TouchableOpacity>
          <WebView
            style={styles.WebViewStyle}
            source={{ uri: place.website }}
            javaScriptEnabled={true}
            domStorageEnabled={true} />
        </View>
        
      );
    }

  }
}

const styles = StyleSheet.create({
  // Man skal altid angive størrelsen på billeeder som loades fra netværk
  image: {
    height:200,
    width:'100%',
    resizeMode:'contain'
  },
  container: {
    margin: 10,
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'space-around',
    width: '90%',
    height: '100%'
  },
  contactview:{
    height: '10%',
    width: '80%',
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-around'
  },
  contactbox:{
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#00c473',
    justifyContent: 'center'
  },
  location:{
    width: 250,
    height: 250,
    borderRadius: 250/2,
    alignSelf: 'center'
  },
  header: {
    fontSize: 28,
    fontFamily: 'Roboto',
    color: COLORS.white,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 1,
    alignSelf: 'center'
  },
  address:{
    alignSelf: 'center',
    color: COLORS.white,
    marginTop: 0
  },
  description:{
    color: COLORS.white,
    fontSize: 18,
    alignSelf: 'center'
  },
  containerWeb: {
    flex: 1,
  },
  checkinbutton:{
    alignItems: 'center',
    alignSelf:'center',
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
