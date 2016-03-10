/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
'use strict';

var React = require('react-native');

var {
    AppRegistry,
    NavigatorIOS,
    StyleSheet,
} = React;


import Camera from 'react-native-camera';

var LoginScreen = require("./LoginScreen");

class ImagePOCProject extends React.Component{
   render() {
       return (
         <NavigatorIOS
             style={styles.container}
             initialRoute={{
                title: 'Login',
                component: LoginScreen
             }}
         />
       );
   }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    }
});

//noinspection JSCheckFunctionSignatures
AppRegistry.registerComponent('ImagePOCProject', ()=>ImagePOCProject);
module.exports = ImagePOCProject;
