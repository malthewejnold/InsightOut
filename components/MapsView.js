import React from 'react';
import {
  ActivityIndicator,
  View,
  FlatList,
  Button,
  TouchableOpacity,
  Text
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import styles from "../styles/stylesheet";
import { Ionicons } from '@expo/vector-icons';
import { db } from '../src/config';
import { getDistance } from 'geolib';
import Sponsor from './Sponsor';

export default class MapsView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      itemPressed: -1,
      region: {
        latitude: 55.676098,
        longitude: 12.568337,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      markers: [],
      yourLocation: {},
      togglesponsor: true
    }

  }

  componentDidMount(){

    this.setState({
      dataSource: this.props.screenProps.data,
      markers: this.props.screenProps.mapmarkers,
      isLoading: false
    });
  }

  handlePress(item){
    this.setState({ 
      region: {
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
        latitudeDelta: 0.0073,
        longitudeDelta: 0.0064,
      }
     });
  }

  render() {

    return (
      <View style={styles.viewMapview}>
      <MapView 
      provider="google"
      showsUserLocation={true}
      region={this.state.region}
      extraData={this.state}
      style={{flex: 14}}
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
      <FlatList
          data={this.state.dataSource.sort((a, b) => a.distanceAway > b.distanceAway)} 
          extraData={this.state}
          horizontal={true}
          style={styles.flatlistHori}
          renderItem={({ item, index }) => (
            <View>
            <TouchableOpacity
              style={styles.buttonSU}
              onPress={() => this.handlePress(item.location.coordinates) }
              >
              <Text style={{color:'orange'}}> {item.name} </Text>
              <Text style={{color:'orange'}}>{Number(item.distanceAway).toLocaleString("es-ES", {maximumFractionDigits: 2, minimumFractionDigits:2})} km.</Text>
            </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.key}
        />
        </View>
    );

  }
}
