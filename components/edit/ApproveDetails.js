import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextInput,
  ScrollView
} from 'react-native';
import COLORS from '../../src/colorconfig';
import { db } from '../../src/config';

export default class PlaceItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        errorAdress: COLORS.lightgray,
        errorName: COLORS.lightgray,
        errorDescription: COLORS.lightgray,
        name: '',
        category: '',
        description: '',
        location: '',
        suitablefor: '',
        email: '',
        phonenumber: '',
        website: '',
        address: '',
        postcode: '',
        country: '',
        city: '',
        latitude: '',
        longitude: ''
    }
  }

  componentDidMount(){
    const place = this.props.navigation.getParam('place');
    this.locationDetails(place);
  }

  approvePlace(place){
    let number = 0;
    let fburl = '';

    db.database().ref('results').orderByChild('key').limitToLast(1).once('value').then(function(result) {

        if(result.numChildren()==0){
          number = 0;
        }else{
          const resultNumber = Object.keys(result.toJSON());
          number = Number(resultNumber[0])+1;
        }
        
        console.log(number);
        console.log(this.state.category);
        console.log(this.state.description);
        console.log(this.state.email);
        console.log(Number(this.state.latitude));
        console.log(Number(this.state.longitude));
        console.log(this.state.city);
        console.log(this.state.country);
        console.log(this.state.name);
        console.log(this.state.phonenumber);
        console.log(this.state.suitablefor);

        fburl = 'results/'+number;
        db.database().ref(fburl).set({
          category: this.state.category,
          description: this.state.description,
          email: this.state.email,
          location: {
            coordinates: {
              latitude: this.state.latitude,
              longitude: this.state.longitude
            },
            city: this.state.city,
            country: this.state.country,
            postcode: this.state.postcode,
            street: {
              name: place.location.street.name,
              number: place.location.street.number
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
          sendinby: place.sendinby,
          checkins: 0,
          key: number
          }).then((data)=>{
          //success callback
          const { goBack } = this.props.navigation;
          alert('stedet er nu godkendt');
          const fburl = 'unapprovedResults/'+place.key;
          db.database().ref(fburl).remove();
          goBack();
          console.log('data ' , data)
          }).catch((error)=>{
          //error callback
          console.log('error ' , error)
        })
  
      }.bind(this));
  }

  deletePlace(place){
    const { goBack } = this.props.navigation;
    const fburl = 'unapprovedResults/'+place.key;
    db.database().ref(fburl).remove();
    goBack();
  }

  locationDetails = async (place) =>{

    const URL = 'https://eu1.locationiq.com/v1/reverse.php?key=3916a4f93569d4&lat='+place.location.coordinates.latitude+'&lon='+place.location.coordinates.longitude+'&format=json';

    try {
        const response = await fetch(URL);
        const json = await response.json();

        this.setState({
            name: place.name,
            description: place.description,
            email: place.email,
            phonenumber: place.phone,
            website: place.website,
            category: place.category,
            address: place.location.street.name +  ' ' + place.location.street.number,
            suitablefor: place.suitablefor,
            city: json.address.city,
            country: json.address.country,
            postcode: json.address.postcode,
            latitude: json.lat,
            longitude: json.lon
        });
  
      } catch (error) {
        console.log('her er fejlen '+error);
      }
  }
  
  
  render() {

    const place = this.props.navigation.getParam('place');

    return (
        <ScrollView>
        <View style={styles.inputcontainer}>
        <TextInput
        style={styles.textinput}
        placeholder='Stedets navn'
        placeholderTextColor={this.state.errorName}
        onChangeText={(name) => this.setState({name})}
        defaultValue = {this.state.name}
        />
        <TextInput
        style={styles.textinput}
        placeholder='Stedets beskrivelse'
        placeholderTextColor={this.state.errorDescription}
        onChangeText={(description) => this.setState({description})}
        defaultValue = {this.state.description}
      />
      <TextInput
      style={styles.textinput}
      placeholder='Email'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(email) => this.setState({email})}
      defaultValue = {this.state.email}
      />
    <TextInput
      style={styles.textinput}
      placeholder='Telefon nr.'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(phonenumber) => this.setState({phonenumber})}
      defaultValue = {this.state.phonenumber}
      />
    <TextInput
      style={styles.textinput}
      placeholder='Website'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(website) => this.setState({website})}
      defaultValue = {this.state.website}
      />
    <TextInput
      style={styles.textinput}
      placeholder='Kategori'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(category) => this.setState({category})}
      defaultValue = {this.state.category}
    />
    <TextInput
      style={styles.textinput}
      placeholder='Tilegnet antal personer'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(suitablefor) => this.setState({suitablefor})}
      defaultValue = {this.state.suitablefor}
      />
    <Text>Stedets lokalitet</Text>
    <TextInput
      style={styles.textinput}
      placeholder='Adresse'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(address) => this.setState({address})}
      defaultValue = {this.state.address}
    />
    <TextInput
      style={styles.textinput}
      placeholder='By'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(city) => this.setState({city})}
      defaultValue = {this.state.city}
    />
    <TextInput
      style={styles.textinput}
      placeholder='Land'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(country) => this.setState({country})}
      defaultValue = {this.state.country}
    />
    <TextInput
      style={styles.textinput}
      placeholder='Postnummer'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(postcode) => this.setState({postcode})}
      defaultValue = {this.state.postcode}
    />
    <TextInput
      style={styles.textinput}
      placeholder='Latitude'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(latitude) => this.setState({latitude})}
      defaultValue = {this.state.latitude}
    />
    <TextInput
      style={styles.textinput}
      placeholder='Longitude'
      placeholderTextColor={this.state.errorAdress}
      onChangeText={(longitude) => this.setState({longitude})}
      defaultValue = {this.state.longitude}
    />

    <TouchableOpacity
      style={styles.button}
        onPress={() => {this.approvePlace(place)}}>
      <Text style={{color:COLORS.navigation}}>Approve sted</Text>
      </TouchableOpacity>
      <TouchableOpacity
      style={styles.button}
      onPress={() => {this.deletePlace(place)}}>
      <Text style={{color:COLORS.navigation}}>Slet sted</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    inputcontainer: {
        alignItems: 'center'
    },
  textinput: {
    height: 60, 
    width: '80%', 
    borderWidth: 1,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10
  },
  button:{
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
  }
});