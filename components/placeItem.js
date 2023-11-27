import * as React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View
} from 'react-native';
import { getDistance } from 'geolib';

export default class PlaceItem extends React.Component {
  constructor(props) {
    super(props);
  }
  
  // Her kalder vi vores onSelect eventhandler, og som argument får den den user vi fik med ind i props.
  handleSelect = () => {
    const { place, onSelect } = this.props;
    console.log(place);
    onSelect(place);
  };
  
  render() {

    const { place } = this.props;
    const { yourLocation } = this.props;
    //  Her håndteres overordnede klik på rækken
    var distance = getDistance({ latitude: Number(yourLocation.coords.latitude), longitude: Number(yourLocation.coords.longitude) }, {
      latitude: Number(place.location.coordinates.latitude),
      longitude: Number(place.location.coordinates.longitude),
    })/1000;
    distance = Number(distance).toLocaleString("es-ES", {maximumFractionDigits: 2});
    return (
      <TouchableOpacity style={styles.container} onPress={this.handleSelect}>
        <View style={styles.row}>
        {/* <Image style={styles.image} source={{ uri: place.picture.thumbnail }} /> */}
        <Text>
          {place.name}
        </Text>
        <Text>
          {distance} km.
        </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flex: 1,
    paddingVertical: 25,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    width: '100%'
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});