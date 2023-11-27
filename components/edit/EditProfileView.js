import * as React from 'react';

import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Image,
  ActionSheetIOS
} from 'react-native';
import { Container, Form, Input, Item, Label } from 'native-base';
import COLORS from '../../src/colorconfig';
import { db } from '../../src/config';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export default class EditProfileView extends React.Component {

constructor(props) {
        super(props);
        this.state = {
          name: 'placeholder',
          username: 'placeholder',
          email: 'placeholder',
          currentUser: {},
          photo: null
        };
        this.onSelectPhoto = this.onSelectPhoto.bind(this);
}

componentDidMount(){

  this.getPermissionAsync();

  const user = this.props.navigation.getParam('currentUser');

  this.setState({
    name: user.fullname,
    username: user.username,
    email: user.email,
    photo: user.photo
  })
}

safechanges(user){

  console.log(this.state.photo);

  const { goBack } = this.props.navigation;

  const fburl = 'users/'+user.uid;
  db.database().ref(fburl).update({ 
    fullname: this.state.name,
    username: this.state.username,
    email: this.state.email,
    photo: this.state.photo
  });

  this.props.screenProps.updateUserInfo(this.state.email, this.state.name, this.state.username, this.state.photo);

  db.auth().currentUser.updateEmail(this.state.email).then(function() {
    console.log('email opdateret');
  }).catch(function(error) {
    console.log(error);
  });
  
  goBack();

  this.updateDBPhoto(this.state.photo, user.uid);

}

updateDBPhoto = async (uri, userUid) => {

  db.storage().ref('profileImages/'+ userUid).delete().then(function() {
  console.log('file deleted');
  }).catch(function(error) {
    console.log('file not deleted')
  });

  const response = await fetch(uri);
  const blob = await response.blob();

  const uploadTask = db.storage().ref('profileImages/'+ userUid).put(blob);

  uploadTask.on("state_changed", snapshot => {
      // progress function ...
      const progress = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      this.setState({ progress });
    },
    error => {
      // Error function ...
      console.log(error);
    },
    () => {
      // complete function ...
      db.storage().ref("profileImages").child(userUid).getDownloadURL().then(url => {
        db.database().ref('users/'+userUid).update({
          photo: url
        })
    });
    }
  );
}



getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      
    }

    const { statusIMG } = await Permissions.askAsync(Permissions.CAMERA);
    if (statusIMG !== 'granted') {
      
    }
  }
}

takePhotoHandler = async () => {

  console.log('test');
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images
  });

  if (!result.cancelled) {
    this.setState({ photo: result.uri });
  }
  else{
    console.log('test')
  }
}

choosePhotoHandler = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
  });

  if (!result.cancelled) {
    this.setState({ photo: result.uri });
  }
}

onSelectPhoto() {
  ActionSheetIOS.showActionSheetWithOptions(
    {
      title: 'Profilbillede',
      options: ['Annuller', 'Tag billede', 'Vælg fra bibliotek'],
      cancelButtonIndex: 0,
    },
    (buttonIndex) => {
      if (buttonIndex === 1) {
        this.takePhotoHandler();
      }
      if (buttonIndex === 2) {
        this.choosePhotoHandler()
      }
    },
  );
}

  render() {
    const user = this.props.navigation.getParam('currentUser');

    return (
      <DismissKeyboard>
      <ScrollView>
      <Container style={styles.container}>
      <Form>
        <TouchableOpacity
        onPress={this.onSelectPhoto}>
        <Image style={styles.avatar} source={{uri: this.state.photo}}/>
        </TouchableOpacity>
        <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Navn</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="words"
            style={{color:COLORS.inputbox}}
            value={this.state.name}
            onChangeText={(name) => this.setState({ name })}
          />
        </Item>
        <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Brugernavn</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            style={{color:COLORS.inputbox}}
            value={this.state.username}
            onChangeText={(username) => this.setState({ username })}
          />
          </Item>
        <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Email</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            style={{color:COLORS.inputbox}}
            value={this.state.email}
            onChangeText={(email) => this.setState({ email })}
          />
          </Item>
          <TouchableOpacity
          style={styles.button}
          onPress={() => {this.safechanges(user)}}>
          <Text style={{color:COLORS.navigation}}>Gem ændringer</Text>
          </TouchableOpacity>
        </Form>
    </Container>
    </ScrollView>
    </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
    header:{
      backgroundColor: COLORS.main,
      height:200,
    },
    body:{
      marginTop:40,
      flexDirection: 'row',
    },
    bodyContent: {
      flex: 9,
      alignItems: 'center',
      justifyContent: 'center',
      padding:30,
    },
    name:{
      fontSize:28,
      color: 'red',
      fontWeight: "600",
    },
    description:{
      fontSize:16,
      color: "#696969",
      marginTop:10,
      textAlign: 'center'
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
    },
    container:{
      backgroundColor: COLORS.background
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 2,
      borderColor: "white",
      marginBottom:10,
      alignSelf:'center',
      marginTop:10
    }
  });
