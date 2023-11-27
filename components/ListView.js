import * as React from 'react';
import {
  ActivityIndicator,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import PlaceItem from './placeItem';
import { db } from '../src/config';
import { getDistance } from 'geolib';
import COLORS from '../src/colorconfig';
import Moment from 'moment';
import Sponsor from './Sponsor';

export default class ListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      itemPressed: -1,
      yourLocation: {},
      togglesponsor: true
    };
  }

  componentDidMount(){

    this.setState({
      dataSource: this.props.screenProps.data
    });
  }

  handleSelectPlace(place){
    this.props.navigation.navigate('Details', { place });
  };

  render() {

    return (
      <View style={{flex:1}}>
      <FlatList
        data={this.state.dataSource.sort((a, b) => a.distanceAway > b.distanceAway)} 
        extraData={this.state}
        renderItem={({ item }) => (
          <View style={styles.flatlistbutton}>
            <TouchableOpacity style={styles.container} onPress={() => {this.handleSelectPlace(item)}}>
              <View style={styles.row}>
              {/* <Image style={styles.image} source={{ uri: place.picture.thumbnail }} /> */}
              <Text style={styles.text}>
                {item.name}
              </Text>
              <Text style={styles.text}>
              {Number(item.distanceAway).toLocaleString("es-ES", {maximumFractionDigits: 2, minimumFractionDigits:2})} km.
              </Text>
              </View>
              <View style={styles.describtion}>
              <Text style={styles.text}>
              {item.category}
              </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.key}
      />
      </View>
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
    width: '100%'
  },
  describtion: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%'
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color: COLORS.white
  }
});