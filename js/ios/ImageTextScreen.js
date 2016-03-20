/**
 * Created by anilkatta on 3/19/16.
 */
'use strict';

var React = require ( 'react-native' );
var View = React.View;
var Text = React.Text;

class ImageTextScreen extends React.Component {
	render() {
		return(
			<View>
				<Text>Hello From Image Screen</Text>
			</View>
		);
	}
}

module.exports = ImageTextScreen;