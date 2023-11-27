import * as React from 'react';
import {
  ActivityIndicator,
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet
} from 'react-native';
import COLORS from '../../src/colorconfig';
import { db } from '../../src/config';
import { getDistance } from 'geolib';

export default class ApproveVenues extends React.Component {

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

    navigator.geolocation.getCurrentPosition(
      position => {
        this.getData(position);
        
        this.setState({
          yourLocation: position
        })
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  getData(position){
    db.database().ref('unapprovedResults').on("value", (result) =>  {

      try{
        const dataArray = Object.keys(result.toJSON()).map(key => ({
          key,
          ...result.toJSON()[key],
          distanceAway: Number(getDistance({
            latitude: Number(position.coords.latitude), 
            longitude: Number(position.coords.longitude) }, {
            latitude: Number(result.toJSON()[key].location.coordinates.latitude),
            longitude: Number(result.toJSON()[key].location.coordinates.longitude),
          })/1000)
      }));
      
      this.setState({
          dataSource: dataArray,
          isLoading: false
      });
      }catch(err){
        this.setState({
          dataSource: {},
          isLoading: false
      });
      }

    });
  }

  handleSelectPlace(place){
    this.props.navigation.navigate('ApproveDetails', { place });
  };

  render() {

    if(this.state.isLoading){
      return(
        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
          <ActivityIndicator size='large' />
        </View>
        
      );
    }else{
      if(Object.keys(this.state.dataSource).length == 0){
        return(
          <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
            <Text style={{color:'white', fontSize: 24}}>Ingen steder at godkende</Text>
          </View>
          
        );
      }else{
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
    color: COLORS.main
  }
});