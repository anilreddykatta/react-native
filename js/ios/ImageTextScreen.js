/**
 * Created by anilkatta on 3/19/16.
 */
'use strict';

var React = require ( 'react-native' );
var View = React.View;
var Text = React.Text;
var StyleSheet = React.StyleSheet;
var ScrollView = React.ScrollView;

class ImageTextScreen extends React.Component {
	constructor ( props ) {
		super ( props );
		this.state = {};
	}

	render () {
		return (
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<View style={styles.mainSection}>
					<Text style={styles.textTitle}>
						Hello {this.props.text.title}
					</Text>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create ( {
	contentContainer: {
		padding: 10,
	},
	mainSection: {
		flexDirection: 'row',
	},
	textTitle: {
		flex: 0,
		fontSize: 16,
		fontWeight: '500',
		paddingLeft: 20,
		paddingBottom: 25,
		color: 'black'
	}
} );

module.exports = ImageTextScreen;