import React, { Component } from 'react';
import { View, Image, SafeAreaView, ScrollView, ActivityIndicator, StyleSheet, Text, Alert } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import TermsIcon from '@expo/vector-icons/FontAwesome5';
import SponsorIcon from '@expo/vector-icons/FontAwesome';
import CloseIcon from '@expo/vector-icons/AntDesign';
import { db } from './src/config';
import * as Facebook from 'expo-facebook';
import firebase from 'firebase';
import { getDistance } from 'geolib';
import COLORSDark from './src/colorconfig';
import COLORSLight from './src/colorslightconfig';

import {
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation';

import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';

import ListView from './components/ListView';
import MapsView from './components/MapsView';
import RandView from './components/RandView';
import AddView from './components/AddView';
import ProfileView from './components/ProfileView';
import ListDetails from './components/ListDetails';
import TermsView from './components/drawer/Terms';
import LoginForm from './components/login/LoginForm';
import SignupForm from './components/login/SignupForm';
import EditProfileView from './components/edit/EditProfileView';
import ApproveVenues from './components/edit/Approve';
import ApproveDetails from './components/edit/ApproveDetails';
import SponsorView from './components/Sponsor';
import { Appearance, AppearanceProvider, useColorScheme } from 'react-native-appearance';

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 150,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

let colorScheme = Appearance.getColorScheme();
let COLORS;

if(colorScheme=='dark'){
  COLORS = COLORSDark
}
if(colorScheme=='light'){
  COLORS = COLORSLight
}

let subscription = Appearance.addChangeListener(({ colorScheme }) => {
  console.log(colorScheme)
});


class App extends Component {
  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: '',
      currentUser:{},
      userData:{},
      isLoading: true,
      dataSource: [],
      yourLocation: {},
      markers: [],
      togglesponsor: true,
      countdowndone: true,
      placeheadertitle: ''
    })
    this.loginWithEmail = this.loginWithEmail.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }

  componentDidMount() {
    
    db.auth().onAuthStateChanged((user) => {
      if (user != null) {
        this.setState({
          currentUser: user
        });

        db.database().ref('users/'+user.uid).once('value').then(function(result) {
          const userDB = result.val();
          this.setState({
            userData: userDB
        });
  
        }.bind(this));
      }
    });

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
    db.database().ref('results').on("value", (result) =>  {

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

      dataArray.map((markerData) => {
        this.setState({
          markers: [
            ...this.state.markers,
            {
              coordinate: {
                latitude: Number(markerData.location.coordinates.latitude),
                longitude: Number(markerData.location.coordinates.longitude)
              },
              title: markerData.name
            }
          ]
        })
      });
    });
  }

  async loginWithFacebook() {

    //ENTER YOUR APP ID 
    const { type, token } = await Facebook.logInWithReadPermissionsAsync('755983434843333', { permissions: ['public_profile', 'email', 'user_age_range'] })

    if (type == 'success') {

      const credential = firebase.auth.FacebookAuthProvider.credential(token);
      const facebookProfileData = await firebase.auth().signInWithCredential(credential);

      const useruid = facebookProfileData.user.uid;
      const fburl = 'users/'+useruid;
      const data = {
        email: facebookProfileData.user.email,
        username: facebookProfileData.user.displayName,
        fullname: facebookProfileData.user.displayName,
        photo: facebookProfileData.user.photoURL + '/?height=500',
        checkins: 0,
        amountearned: 0,

      };
      db.database().ref(fburl).set(data, function(error) {
        if (error) {
          console.log("Data could not be saved." + error);
        } else {
          console.log("Data saved successfully.");
        }
      });

      db.auth().signInWithCredential(credential).catch((error) => {
        console.log(error)
      })
    }
    else{
      console.log('fejl i facebook login')
    }
  }

  //Skal testes når logud virker!!
  loginWithEmail(email, password) {
    db.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      db.auth().onAuthStateChanged(function(user) {
        if (user) {
          db.database().ref('users/'+user.uid).once('value').then(function(result) {
            const userDB = result.val();
            console.log(userDB);
            this.setState({
              userData: userDB,
              currentUser: user
          });
    
          }.bind(this));

        } else {
          // User is signed out.
          // ...
        }
      });
    })
    .catch((error) =>{
        console.log(error)
    })
  }

  updateUser(checkinsUpdate, placekey, amountearnedUpdate){

    let user = this.state.userData;

    user.lastcheckin = placekey;
    user.checkins = checkinsUpdate;
    user.amountearned = amountearnedUpdate;

    this.setState({
      userData: user
    })

  }

  updateUserInfo(email, name, username, photo){

    let user = this.state.userData;

    user.fullname = name;
    user.email = email;
    user.username = username;
    user.photo = photo;

    this.setState({
      userData: user
    })

  }

  rendercontent(){
    if(this.state.togglesponsor && this.state.countdowndone){
      return (
        <SafeAreaView style={{flex:4, backgroundColor:COLORS.background}}>
        <SponsorView/>
        <View style={styles.loading}>
          <Icon style={{ color:'green' }} onPress={() => {this.setState({togglesponsor:false})}} name="md-checkmark-circle-outline" size={50} />
        </View>
        </SafeAreaView>
      );
    }else{
      return (<AppContainer
        screenProps={{ 
          currentUser: this.state.userData,
          isLoading: this.state.isLoading,
          data: this.state.dataSource,
          mapmarkers: this.state.markers,
          updateUser: this.updateUser,
          updateUserInfo: this.updateUserInfo
         }}
        />
        );
    }
  }

  render() {

    if(Object.keys(this.state.currentUser) == 0){
      return (
        <LoginContainer 
        screenProps={{
          loginEmail: this.loginWithEmail,
          loginFacebook: this.loginWithFacebook,
          signUpForm: this.signUp,
          navigation: this.props.navigation
        }} 
        />
      );
    }else{
      if(Object.keys(this.state.dataSource).length == 0){
        return(
          <SafeAreaView style={{flex:1, backgroundColor:COLORS.background}}>
          <SponsorView/>
          <View style={styles.loading}>
          <ActivityIndicator size='large' />
          </View>
          </SafeAreaView>
        );
      }else{
        return(this.rendercontent());
      }
    }
  }
}

export default App;

const ListStack = createStackNavigator(
  {
    List: {
      screen: ListView,
      navigationOptions: ({ navigation }) => {
        return {
        headerTitle: (
          <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
        ),
          headerStyle: {
            backgroundColor: COLORS.navigation
          },
          headerTitleStyle: {
            color: COLORS.main
          },
          headerLeft: (
            <Icon style={{ paddingLeft: 10, color: COLORS.white }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
          )
        };
      }
    },
    Details: {
      screen: ListDetails,
      navigationOptions: ({ navigation }) => {
        return {
          headerTitle: (
            <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
          ),
          headerStyle: {
            backgroundColor: COLORS.navigation
          },
          headerTitleStyle: {
            color: COLORS.main
          }
        };
      }
    }
  },
  {
    cardStyle: { backgroundColor: COLORS.background},
  }

);

const MapsStack = createStackNavigator({
  Map: {
    screen: MapsView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: (
          <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
        ),
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
        headerLeft: (
          <Icon style={{ paddingLeft: 10, color: COLORS.white }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  },
  Details: {
      screen: ListDetails
  }
  },
  {
    cardStyle: { backgroundColor: COLORS.background},
  }
);
const RandStack = createStackNavigator({
  Random: {
    screen: RandView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: (
          <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
        ),
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
        headerLeft: (
          <Icon style={{ paddingLeft: 10, color: COLORS.white}} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
},
{
  cardStyle: { backgroundColor: COLORS.background},
}
);

const AddStack = createStackNavigator({
  Add: {
    screen: AddView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: (
          <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
        ),
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
        headerLeft: (
          <Icon style={{ paddingLeft: 10, color: COLORS.white }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
},
{
  cardStyle: { backgroundColor: COLORS.background}
}
);

const ProfileStack = createStackNavigator({
  Profile: {
    screen: ProfileView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: (
          <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
        ),
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
        headerLeft: (
          <Icon style={{ paddingLeft: 10, color: COLORS.white }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  },
  EditProfile: {
    screen: EditProfileView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Rediger din profil',
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        }
      };
    }
  },
  ApprovePlaces: {
    screen: ApproveVenues,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Godkend steder',
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
      };
    }
  },
  ApproveDetails: {
    screen: ApproveDetails,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Godkend steder',
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
      };
    }
  }
},
{
  cardStyle: { backgroundColor: COLORS.background},
}
);

const TermsStack = createStackNavigator({
  Terms: {
    screen: TermsView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Terms & conditions',
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
        headerLeft: (
          <Icon style={{ paddingLeft: 10, color: COLORS.white }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
},
{
  cardStyle: { backgroundColor: COLORS.background},
}
);

const SponsorStack = createStackNavigator({
  Sponsor: {
    screen: SponsorView,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Sponsor',
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
        headerLeft: (
          <Icon style={{ paddingLeft: 10, color: COLORS.white }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
},
{
  cardStyle: { backgroundColor: COLORS.background},
}
);

const DashboardTabNavigator = createBottomTabNavigator(
  {
    List: {  
      screen: ListStack,  
      navigationOptions:{  
        tabBarLabel:'Liste',  
        tabBarIcon:({tintColor})=>(  
          <Icon name="md-list" color={tintColor} size={25}/>  
        )  
      }
    },
    Map: {  
      screen: MapsStack,  
      navigationOptions:{  
        tabBarLabel:'Kort', 
        tabBarIcon:({tintColor})=>(  
          <Icon name="ios-pin" color={tintColor} size={25}/>   
        )  
      }
    },
    Add:{  
      screen:AddStack,  
      navigationOptions:{  
        tabBarLabel:'Tilføj',
        tabBarIcon:({tintColor})=>(  
          <Icon name="ios-add-circle-outline" color={tintColor} size={25}/>   
        )  
      }
    },
    Random:{  
      screen:RandStack,  
      navigationOptions:{  
        tabBarLabel:'Tilfældig',  
        tabBarIcon:({tintColor})=>(  
          <Icon name="ios-shuffle" color={tintColor} size={25}/>   
        )  
      }
    },
    Profile:{  
      screen:ProfileStack,  
      navigationOptions:{  
        tabBarLabel:'Profil',  
        tabBarIcon:({tintColor})=>( 
            <Icon name="ios-contact" color={tintColor} size={25}/> 
        )  
      }
    }
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state.routes[navigation.state.index];
      return {
        header: null,
        headerTitle: routeName
      };
    },
    tabBarOptions: { style:{backgroundColor: COLORS.navigation}, activeTintColor: COLORS.main, inactiveTintColor: 'gray', }
  }
  
);

const DashboardStackNavigator = createStackNavigator(
  {
    DashboardTabNavigator: DashboardTabNavigator
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon style={{ paddingLeft: 10, color: COLORS.white }} onPress={() => navigation.openDrawer()} name="md-menu" size={30} />
        )
      };
    }
  }
);


const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{flex:1, backgroundColor: COLORS.background}}>
    <View style={{height: 150, backgroundColor: COLORS.main, alignItems:'center', justifyContent: 'center'}}>
      <Image source={require('./assets/IO.png')} style={{height:150, width:150,resizeMode:'contain'}}/>
    </View>
    <ScrollView>
      <DrawerNavigatorItems {...props}/>
    </ScrollView>
  </SafeAreaView>
)

const AppDrawerNavigator = createDrawerNavigator({
  Hjem: {
    screen: DashboardStackNavigator,
    navigationOptions: {
      drawerLabel: 'Hjem',
      drawerIcon: ({ tintColor }) => (
        <Icon name="ios-home" color={tintColor} size={25}/>
      )
    }
  },
  Terms: {
    screen: TermsStack,
    navigationOptions: {
      drawerLabel: 'Terms & Conditions',
      drawerIcon: ({ tintColor }) => (
        <TermsIcon name="clipboard-list" color={tintColor} size={25}/>
      )
    }
  },
  Sponsor:{
    screen: SponsorStack,
    navigationOptions: {
      drawerLabel: 'Sponsorer',
      drawerIcon: ({ tintColor }) => (
        <SponsorIcon name="handshake-o" color={tintColor} size={25}/>
      )
    }
  }
},{
  contentComponent: CustomDrawerComponent,
  contentOptions: {
    activeTintColor: COLORS.main,
    style: {
      backgroundColor: COLORS.background
    }
  }
  
}
)

const AppSwitchNavigator = createSwitchNavigator({
  /*Welcome: { screen: WelcomeScreen },*/
  Dashboard: { screen: AppDrawerNavigator }
});

const AppContainer = createAppContainer(AppSwitchNavigator);

const FrontStack = createStackNavigator({
  Login: {
    screen: LoginForm,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: (
          <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
        ),
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
      };
    }
  },
  Signup: {
    screen: SignupForm,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: (
          <Image style={{height:50, width:'100%', resizeMode:'contain'}} source={require('./assets/IO.png')}/>
        ),
        headerStyle: {
          backgroundColor: COLORS.navigation
        },
        headerTitleStyle: {
          color: COLORS.main
        },
      };
    }
  }
},
{
  cardStyle: { backgroundColor: COLORS.background},
}
);

const LoginContainer = createAppContainer(FrontStack);