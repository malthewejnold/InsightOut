import { StyleSheet } from "react-native"

export default StyleSheet.create({
    buttoncontainer: {
        width: '34%',
        borderTopColor: '#999999',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 4, // <- Remove this and the right border becomes blue.
        alignItems: 'center',
      },
      buttonPic: {
        top: 15,
      },
      buttonText:{
        top: 25,
        color: '#999999',
        alignSelf: 'center',
      },
      container: {
        top: 10,
        flex: 10,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'flex-start',
      },
      logo: {
        width: '100%',
        height: 150,
        backgroundColor: '#999999',
        alignItems: 'stretch',
        justifyContent: 'space-around'
      },
      logoText: {
        fontSize: 40,
        fontWeight: 'bold'
      },
      buttons: {
        width: '100%', 
          height: 125, 
          backgroundColor: '#ffffff', 
          position: 'absolute',
          bottom: 0,
          flexDirection: 'row'
      },
      flatlist: {
        alignItems: 'stretch',
      },
      flatlistHori: {
        flex: 1,
        alignItems: 'center',
        flexGrow: 1
      },
      viewMapview: {
        flex: 15
      },
      buttonSU: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        height: '85%',
        marginLeft: 3,
        borderRadius: 5,
        fontSize: 14,
        borderColor: 'orange',
        borderWidth: 1
      }
});