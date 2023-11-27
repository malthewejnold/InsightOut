import React from 'react'
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Picker
} from 'react-native';
import COLORS from '../src/colorconfig';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../src/config';

export default class AddView extends React.Component {

  constructor(props) {
          super(props);
          this.state = {
            name: '',
            description: '',
            location: '',
            placelocation: '',
            region: {
              latitude: 55.676098,
              longitude: 12.568337,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            },
            email: '',
            phonenumber: '',
            website: '',
            markers: [],
            errorAdress: COLORS.lightgray,
            errorName: COLORS.lightgray,
            errorDescription: COLORS.lightgray,
            placeholderAdress: "Skriv stedets adresse",
            placeholderName: "Stedets navn",
            placeholderDescription: "Beskriv hvad der er fedt ved stedet",
            suitablefor: ''
          };
  }

  addPlace = () => {

    let number = 0;
    let fburl = '';

    console.log(this.state.placelocation.number);
    console.log(this.state.placelocation.name);

    if(this.state.markers.length!=0 && this.state.name.length!=0 && this.state.description.length!=0){
      if(isNaN(this.state.placelocation.number)){
        this.textInput.clear();
        this.setState({
          placeholderAdress: "Angiv venligst en gyldig adresse med dørnummer",
          errorAdress: 'red'
        });
      }else{

          db.database().ref('unapprovedResults').orderByChild('key').limitToLast(1).once('value').then(function(result) {

          console.log(result.numChildren());

          if(result.numChildren()==0){
            number = 0;
          }else{
            const resultNumber = Object.keys(result.toJSON());
            number = Number(resultNumber[0])+1;
          }
    
          fburl = 'unapprovedResults/'+number;
          db.database().ref(fburl).set({
            approved: false,
            category: "not defined",
            description: this.state.description,
            email: this.state.email,
            location: {
              coordinates: {
                latitude: this.state.markers[0].coordinate.latitude,
                longitude: this.state.markers[0].coordinate.longitude
              },
              city: '',
              country: '',
              postcode: 0,
              street: {
                name: this.state.placelocation.name,
                number: this.state.placelocation.number
              }
            },
            name: this.state.name,
            phone: this.state.phonenumber,
            picture: {
              large: "NaN",
              medium: "NaN",
              thumbnail: "NaN"
            },
            suitablefor: this.state.suitablefor,
            website: this.state.website,
            sendinby: this.props.screenProps.currentUser,
            checkins: 0,
            key: number
            }).then((data)=>{
            //success callback
            console.log('data ' , data)
            }).catch((error)=>{
            //error callback
            console.log('error ' , error)
          }) 
        
    
        }.bind(this));

        Alert.alert(
          'TAK',
          'Du har tilføjet et sted til InsightOut. Du får besked hvis stedet bliver godkendt'
        );
      }
    }else{
      if(this.state.name.length==0){
        this.setState({
          placeholderName: "Angiv venligst et navn på stedet",
          errorName: 'red'
        });
      }
      
      if(this.state.description.length==0){
        this.setState({
          placeholderDescription: "Angiv venligst en beskrivelse",
          errorDescription: 'red'
        });
      }

      if(this.state.markers.length==0){
        this.setState({
          placeholderAdress: "Angiv venligst en gyldig adresse med dørnummer",
          errorAdress: 'red'
        });
      }
    }

  };

  loadLocation = async (location) => {
    const streetNumber = parseInt(location.replace(/[^0-9\.]/g, ''), 10);
    const streetName = location.replace(/[0-9]/g, '');

    this.setState({
      placelocation: {
        number: streetNumber,
        name: streetName
      }
    });
    location = location.replace(" ", "%20");

    const URL = 'https://eu1.locationiq.com/v1/search.php?key=3916a4f93569d4&q='+location+'&format=json'

    try {
      const response = await fetch(URL);
      const json = await response.json();

      this.setState({
        markers: [
          {
            coordinate: {
              latitude: Number(json[0].lat),
              longitude: Number(json[0].lon)
            },
            title: this.state.name
          }
        ],
        region: {
          latitude: Number(json[0].lat),
          longitude: Number(json[0].lon),
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }

      })
  
      console.log(this.state.name);
      console.log(this.state.description);
      console.log(this.state.markers[0].coordinate.latitude);
      console.log(this.state.markers[0].coordinate.longitude);
      console.log(this.state.placelocation);

    } catch (error) {
      //GØR NOGET RØDT
      console.log(error);
    }
  }

  suitablefor = (suitablefor) => {
    this.setState({ suitablefor: suitablefor })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.inputcontainer}>
        <TextInput
        style={styles.textinput}
        placeholder={this.state.placeholderName}
        placeholderTextColor={this.state.errorName}
        onChangeText={(name) => this.setState({name})}
        />
        <TextInput
        style={styles.textinput}
        placeholder={this.state.placeholderDescription}
        placeholderTextColor={this.state.errorDescription}
        onChangeText={(description) => this.setState({description})}
      />
      <TextInput
      ref={input => { this.textInput = input }}
      style={styles.textinput}
      placeholder={this.state.placeholderAdress}
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(location) => this.loadLocation(location)}
      />
      <TextInput
        style={styles.textinput}
        placeholder="Email adresse"
        placeholderTextColor={COLORS.lightgray}
        onChangeText={(email) => this.setState({email})}
      />
      <TextInput
        style={styles.textinput}
        placeholder="Telefon nr."
        placeholderTextColor={COLORS.lightgray}
        onChangeText={(phonenumber) => this.setState({phonenumber})}
      />
      <TextInput
        style={styles.textinput}
        placeholder="Website"
        placeholderTextColor={COLORS.lightgray}
        onChangeText={(website) => this.setState({website})}
      />
      </View>
      <View style={{width:'100%', marginTop: 0, flex:1}}>
          <Picker itemStyle={{height: 50, color:COLORS.white}} selectedValue = {this.state.suitablefor} onValueChange = {this.suitablefor}>
            <Picker.Item label = "Tilegnet antal personer" value = "NaN" />
            <Picker.Item label = "1+" value = "1+" />
            <Picker.Item label = "2+" value = "2+" />
            <Picker.Item label = "3+" value = "3+" />
            <Picker.Item label = "4+" value = "4+" />
            <Picker.Item label = "5+" value = "5+" />
          </Picker>
      </View>
      <MapView 
      provider="google"
      showsUserLocation={true}
      region={this.state.region}
      extraData={this.state}
      style={{flex: 3}}
      // onLongPress={this.handleLongPress}
      >
        {this.state.markers.map((marker)=>{
        return (
        <Marker
        key={marker.title}
        {...marker}
        >
          <View style={styles.marker}>
          <Ionicons name="ios-information-circle" color="orange" size={30}/> 
          </View>
        </Marker>
          )
      })}  
      </MapView>
      <TouchableOpacity
      style={styles.website}
      onPress={this.addPlace}>
      <Text style={{color:COLORS.navigation}}>Tilføj sted</Text>
      </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 5
    },
    inputcontainer: {
      alignItems: 'center'
    },
    website:{
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        fontSize: 14,
        borderColor: COLORS.navigation,
        borderWidth: 1,
        shadowColor: 'rgba(0,0,0, .4)', // IOS
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
    },
    textinput: {
      height: 50, 
      width: '80%', 
      borderWidth: 1,
      backgroundColor: COLORS.white,
      borderRadius: 10,
      marginTop: 5,
      marginBottom: 5
    }
});
