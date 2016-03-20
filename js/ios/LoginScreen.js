/**
 * Created by anilkatta on 3/3/16.
 */

'use strict';

var React = require ( 'react-native' );
var StyleSheet = React.StyleSheet;
var TextInput = React.TextInput;
var View = React.View;
var TouchableHighlight = React.TouchableHighlight;
var Text = React.Text;
var AsyncStorage = React.AsyncStorage;
var Alert = React.Alert;

var GLOBAL_SETTINGS = require ( './../global' );
var UserScreen = require ( "./UserScreen" );

class LoginScreen extends React.Component {
	constructor ( props ) {
		super ( props );
		this.state = {
			username: null,
			password: null,
			isLoggedIn: false
		};
		this._input = null;
	}

	componentDidMount () {
		this._input.focus ();
	}

	render () {
		return (
			<View style={styles.container}>
				<TextInput
					autoCapitalize="none"
					style={styles.username}
					placeholder="username"
					autoCorrect={false}
					ref={(c) => this._input = c}
					value={this.state.username}
					onChangeText={this._usernameChanged.bind(this)}
				/>
				<TextInput
					autoCapitalize="none"
					secureTextEntry={true}
					style={styles.password}
					placeholder="password"
					autoCorrect={false}
					ref="password"
					value={this.state.password}
					onChangeText={this._passwordChanged.bind(this)}
				/>
				<TouchableHighlight style={styles.loginbutton} onPress={this._loginButtonClicked.bind(this)}>
					<Text style={styles.buttontext}>Login</Text>
				</TouchableHighlight>
			</View>
		);
	}

	_loginButtonClicked () {
		console.log ( this.state );
		fetch ( GLOBAL_SETTINGS.API.API_ENDPOINT + '/users/login', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify ( {
				username: this.state.username,
				password: this.state.password
			} )
		} )
			.then ( ( response ) => {
				if ( response.status == 'success' ) {
					var userData = response.data;
					AsyncStorage.setItem ( GLOBAL_SETTINGS.STRING_DEFINITION.AUTH_TOKEN, userData[ GLOBAL_SETTINGS.STRING_DEFINITION.TOKEN ], () => this.state.isLoggedIn = true, ( error ) => console.log ( error ) );
					this._navigateToTheUserScreen ( userData );
				} else {
					Alert.alert (
						'Invalid Credentials',
						'Wrong username or password',
						[
							{
								text: 'OK', onPress: () => {
								this._clearInputBoxes ();
							}
							}
						]
					)
				}
			} )
			.catch ( ( error ) => {
				console.log ( error );
			} );
	}

	_clearInputBoxes () {
		this.state.username = '';
		this.state.password = '';
	}

	_usernameChanged ( text ) {
		console.log ( text );
		this.state.username = text.toLowerCase ();
	}

	_passwordChanged ( text ) {
		console.log ( text );
		this.state.password = text.toLowerCase ();
	}

	_navigateToTheUserScreen ( userObject, token ) {
		this.props.navigator.push ( {
			title: userObject.username,
			component: UserScreen,
			passProps: { user: userObject }
		} );
	}

}

const styles = StyleSheet.create ( {
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "transparent",
		flexDirection: 'column'
	},
	username: {
		height: 30,
		borderColor: 'gray',
		borderWidth: 1,
		marginLeft: 30,
		marginRight: 30,
		padding: 5,
		fontSize: 15
	},
	password: {
		height: 30,
		borderColor: 'gray',
		borderWidth: 1,
		marginLeft: 30,
		marginRight: 30,
		marginTop: 15,
		padding: 5,
		fontSize: 15
	},
	loginbutton: {
		justifyContent: 'center',
		height: 30,
		width: 200,
		padding: 5,
		backgroundColor: 'red',
		alignItems: 'center',
		marginTop: 15
	},
	buttontext: {
		color: 'white'
	}
} );

module.exports = LoginScreen;
