/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
'use strict';

var React = require ( 'react-native' );
var GLOBAL_SETTINGS = require ( './js/global' );

var AppRegistry = React.AppRegistry;
var NavigatorIOS = React.NavigatorIOS;
var StyleSheet = React.StyleSheet;
var AsyncStorage = React.AsyncStorage;


var LoginScreen = require ( "./js/ios/LoginScreen" );
var UserScreen = require ( './js/ios/UserScreen' );

class ImagePOCProject extends React.Component {
	constructor ( props ) {
		super ( props )
	}

	render () {
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
}

const styles = StyleSheet.create ( {
	container: {
		flex: 1,
		backgroundColor: 'white'
	}
} );

//noinspection JSCheckFunctionSignatures
AppRegistry.registerComponent ( 'ImagePOCProject', ()=>ImagePOCProject );
module.exports = ImagePOCProject;
