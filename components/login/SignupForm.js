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
import { db } from '../../src/config';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import COLORS from '../../src/colorconfig';
import Moment from 'moment'; 

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export default class SignUpForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: '',
      username: '',
      fullname: '',
      photo: null,
      isLoading: false,
      isCompleted: false,
      errorMessage: null,
      progess: 0
    })
    this.onSelectPhoto = this.onSelectPhoto.bind(this);
  }

  setError = errorMessage => this.setState({ errorMessage });

  singUpWithEmail(email, password) {
    let date = new Date();
    date = Moment(date).format("MM/DD/YYYY");
    db.auth().createUserWithEmailAndPassword(email, password)
    .then(data => {
      if(this.state.photo!=null){
        console.log('billede er ikke nul!')
        this.uploadImage(this.state.photo, data.user.uid)
        .then(()=>{
          const useruid = data.user.uid;
          const fburl = 'users/'+useruid;
    
          db.database().ref(fburl).set({
            email: this.state.email,
            username: this.state.username,
            fullname: this.state.fullname,
            photo: this.state.photo,
            checkins: 0,
            amountearned: 0,
            lastlogin: date,
            createdat: date,
            uid: useruid,
            lastcheckin: 0
            }).then((data)=>{
            //success callback
            console.log('data ' , data)
            }).catch((error)=>{
            //error callback
            console.log('error ' , error)
          }) 
        })
        .catch((error)=>{
          console.log('error ' + error.message)
        })
      }else{
        const useruid = data.user.uid;
        const fburl = 'users/'+useruid;
  
        db.database().ref(fburl).set({
          email: this.state.email,
          username: this.state.username,
          fullname: this.state.fullname,
          photo: this.state.photo,
          checkins: 0,
          amountearned: 0,
          lastlogin: date,
          createdat: date,
          uid: useruid,
          lastcheckin: 0
          }).then((data)=>{
          //success callback
          console.log('data ' , data)
          }).catch((error)=>{
            console.log('error ' + error.message)
        }) 
      }
    })
    .catch((error) =>{
      if (error.code == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
       console.log(error.message)
      }
    })
  }

  componentDidMount() {
    this.getPermissionAsync();
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

  takePhotoHandler = async () => {
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

  uploadImage = async (uri, userUid) => {

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

  render = () => {
    let photourl = ''
    if(this.state.photo==null){
      photourl = 'https://firebasestorage.googleapis.com/v0/b/insideout-af169.appspot.com/o/no-photo-people-profile.jpg?alt=media&token=5e568a0a-6f99-4b5a-8e2e-cdfcfc4cda41'
    }else{
      photourl = this.state.photo
    }

    const { errorMessage, email, password, isCompleted } = this.state;
    if (isCompleted) {
      return <Text>You are now signed up</Text>;
    }
    return (
      <DismissKeyboard>
      <ScrollView>
      <Container style={styles.container}>
      <Form>
        <TouchableOpacity
        onPress={this.onSelectPhoto}
        >
        <Image style={styles.avatar} source={{uri: photourl}}/>
        <Text style={{color:COLORS.white, alignSelf: 'center'}}>Vælg profilbillede</Text>
        </TouchableOpacity>
        <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Brugernavn</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            style={{color:COLORS.inputbox}}
            onChangeText={(username) => this.setState({ username })}
          />
        </Item>
        <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Fulde navn</Label>
          <Input
            autoCorrect={true}
            autoCapitalize="words"
            style={{color:COLORS.inputbox}}
            onChangeText={(fullname) => this.setState({ fullname })}
          />
        </Item>
        <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Email</Label>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            style={{color:COLORS.inputbox}}
            onChangeText={(email) => this.setState({ email })}
          />
        </Item>
        <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Password</Label>
          <Input
            secureTextEntry={true}
            autoCorrect={false}
            style={{color:COLORS.inputbox}}
            autoCapitalize="none"
            onChangeText={(password) => this.setState({ password })}
          />
          </Item>
          <Item floatingLabel>
          <Label style={{color:COLORS.inputbox}}>Repeat Passwrod</Label>
          <Input
            secureTextEntry={true}
            autoCorrect={false}
            style={{color:COLORS.inputbox}}
            autoCapitalize="none"
            // onChangeText={(repeatedpassword) => }
          />
          </Item>

          {errorMessage && (<Text style={{color:'red'}}>Error: {errorMessage}</Text>)}
          <Text style={{color:COLORS.inputbox, marginTop: 15, alignSelf:'center'}}>Ved at trykke Tilmeld og acceptér erklærer du, at du har læst vores Privatspolitik og accepterer vores Servicevilkår</Text>
          <TouchableOpacity
              style={styles.button}
              onPress={() => {this.singUpWithEmail(this.state.email, this.state.password)}}
            >
              <Text style={{color:COLORS.white}}> Tilmeld og acceptér </Text>
            </TouchableOpacity>
        </Form>
    </Container>
    </ScrollView>
    </DismissKeyboard>
    );
  };
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  inputField: {
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  header: {
    fontSize: 40,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.main,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    fontSize: 14
  },
  IMGbutton:{
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: '50%',
    borderColor: COLORS.main,
    borderWidth: 1,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    fontSize: 14
  },
  imageButtons: {
    flexDirection:'row', 
    alignSelf: 'stretch',
    textAlign: 'center',
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