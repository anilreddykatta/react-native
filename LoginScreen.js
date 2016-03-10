/**
 * Created by anilkatta on 3/3/16.
 */

'use strict';

var React = require('react-native');
var StyleSheet = React.StyleSheet;
var TextInput = React.TextInput;
var View = React.View;
var TouchableHighlight = React.TouchableHighlight;
var Text = React.Text;

var API_ENDPOINT = 'https://api.thinkclear.com/imagepoc/api/login';
var API_KEY = '';

class LoginScreen extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: null,
			password: null
		};
	}

	render() {
		return (
			<View style={styles.container}>
				<TextInput
					style={styles.username}
					placeholder="username"
					ref="username"
					value={this.state.username}
					onChangeText={(text) => this.state.username = text}
				/>
				<TextInput
					secureTextEntry={true}
					style={styles.password}
					placeholder="password"
					ref="password"
					value={this.state.password}
					onChangeText={(text) => this.state.password = text}
				/>
				<TouchableHighlight style={styles.loginbutton} onPress={this.loginButtonClicked}>
					<Text style={styles.buttontext}>Login</Text>
				</TouchableHighlight>
			</View>
		);
	}

	loginButtonClicked() {
		console.log(this.state);
		fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username: this.state.username,
				password: this.state.password
			})
		})
		.then((response) => response.text())
		.then((responseData) => {
			console.log(responseData);
		})
		.catch((error) => {
			console.log(error);
		});
	}
}

const styles = StyleSheet.create({
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
});

module.exports = LoginScreen;
