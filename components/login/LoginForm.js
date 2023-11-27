import * as React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from 'react-native';
import { Container, Form, Input, Item, Label } from 'native-base';
import COLORS from '../../src/colorconfig';

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
)

export default class LoginForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = ({
      email: '',
      password: '',
      isLoading: false,
      isCompleted: false,
      errorMessage: null,
    })
  }

  render = () => {
    const {navigate} = this.props.navigation;
    const { errorMessage, email, password, isCompleted } = this.state;
    if (isCompleted) {
      return <Text>You are now logged in</Text>;
    }
    return (
      <DismissKeyboard>
      <ScrollView>
        <Container style={styles.container}>
          <Form>
          <TouchableOpacity
              style={styles.buttonFB}
              onPress={this.props.screenProps.loginFacebook}
              >
              <Text style={{color:COLORS.white}}> Login med Facebook </Text>
          </TouchableOpacity>
              {/* <Text style={{marginTop:30, fontSize: 14}}>
              —————————— OR ——————————
              </Text> */}
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
                autoCapitalize="none"
                style={{color:COLORS.inputbox}}
                onChangeText={(password) => this.setState({ password })}
              />
            </Item>
  
            <TouchableOpacity
              style={styles.button}
              onPress={() => {this.props.screenProps.loginEmail(this.state.email, this.state.password)}}
              >
              <Text style={{color:'white'}}> Log in</Text>
            </TouchableOpacity>
  
            <TouchableOpacity
              style={styles.buttonSU}
              onPress={() => navigate('Signup')}
            >
              <Text style={{color:COLORS.main}}> Sign up </Text>
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
  buttonFB: {
    alignItems: 'center',
    backgroundColor: '#3b5998',
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    fontSize: 14,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.main,
    padding: 10,
    marginTop: 30,
    borderRadius: 10,
    fontSize: 14,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
  },
  buttonSU: {
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 10,
    marginTop: 20,
    borderRadius: 10,
    fontSize: 14,
    borderColor: COLORS.main,
    borderWidth: 1,
    shadowColor: 'rgba(0,0,0, .4)', // IOS
    shadowOffset: { height: 2, width: 2 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
  },
  container:{
    width: '80%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background
  }
});