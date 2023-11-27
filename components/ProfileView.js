import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Alert
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import COLORS from '../src/colorconfig';
import Icon from '@expo/vector-icons/Ionicons';

export default class ProfileView extends Component {

  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: ''
    })
  }
  renderAdminContent(){
    const {navigate} = this.props.navigation;
    const currentUser = this.props.screenProps.currentUser;

    if(currentUser.type=="Admin"){
      return(
        <TouchableOpacity
        onPress={() => navigate('ApprovePlaces')}
        style={styles.button}
        >
        <Text>Godkend steder</Text>
        </TouchableOpacity>
      );
    }
  }

  render() {
    const {navigate} = this.props.navigation;
    const currentUser = this.props.screenProps.currentUser;
    let photoUrl = this.props.screenProps.currentUser.photo;
    if(this.props.screenProps.currentUser.photo==null){
      photoUrl = 'https://firebasestorage.googleapis.com/v0/b/insideout-af169.appspot.com/o/no-photo-people-profile.jpg?alt=media&token=5e568a0a-6f99-4b5a-8e2e-cdfcfc4cda41';
    }
    return (
      <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: photoUrl}}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>{this.props.screenProps.currentUser.fullname}</Text>
              <View style={{flexDirection:'row', marginTop: 20, width:'100%', justifyContent: 'space-around'}}>
                <TouchableOpacity>
                <View style={styles.rewards}>
                  <Text style={styles.rewardsmalltext}>Saldo</Text>
                  <Text style={styles.rewardbigtext}>{Number(this.props.screenProps.currentUser.amountearned).toLocaleString("es-ES", {maximumFractionDigits: 2, minimumFractionDigits:2})} kr.</Text>
                  <Icon name="ios-arrow-forward" style={styles.rewardsmalltext} size={25}/>
                </View>
                </TouchableOpacity>
                <TouchableOpacity>
                <View style={styles.rewards}>
                  <Text style={styles.rewardsmalltext}>Check-in(s)</Text>
                  <Text style={styles.rewardbigtext}>{this.props.screenProps.currentUser.checkins}</Text>
                  <Icon name="ios-arrow-forward" style={styles.rewardsmalltext} size={25}/>
                </View>
                </TouchableOpacity>
              </View>
              
                <TouchableOpacity
                onPress={() => navigate('EditProfile', {currentUser})}
                style={styles.button}
                >
                <Text>Redigér profil</Text>
                </TouchableOpacity>
                {this.renderAdminContent()}
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: COLORS.main,
    height:180,
  },
  rewards: { 
    width: 150,
    height: 150,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: "white",
    alignSelf: 'center',
    marginBottom:10,
    backgroundColor: COLORS.main,
    justifyContent: 'space-around'
  },
  avatar: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:90
  },
  body:{
    marginTop:60,
    flexDirection: 'row',
  },
  bodyContent: {
    flex: 9,
    alignItems: 'center',
    justifyContent: 'center',
    padding:30,
  },
  name:{
    marginBottom: 30,
    fontSize: 28,
    fontFamily: 'Roboto',
    color: COLORS.white,
    shadowColor: 'rgba(0,0,0, .4)',
    shadowOffset: { height: 2, width: 2 },
    shadowOpacity: 1,
    shadowRadius: 1
  },
  info:{
    fontSize:16,
    color: COLORS.main,
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  rewardsmalltext:{
    fontSize:16,
    color: COLORS.navigation,
    textAlign: 'center'
  },
  rewardbigtext:{
    fontSize: 30,
    color: COLORS.navigation,
    textAlign: 'center'
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.main,
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
    fontSize: 14,
    width: '75%'
  }
});