/**
 * Created by anilkatta on 3/19/16.
 */
'use strict';

var React = require ( "react-native" );
var View = React.View;
var StyleSheet = React.StyleSheet;
var Text = React.Text;
var TouchableHighlight = React.TouchableHighlight;
var TouchableNativeFeedback = React.TouchableNativeFeedback;
var Platform = React.Platform;

class ImageTextCell extends React.Component {
	render () {
		var TouchableElement = TouchableHighlight;
		if ( Platform.OS === 'android' ) {
			TouchableElement = TouchableNativeFeedback;
		}
		return (
			<View>
				<TouchableElement
					onPress={this.props.onSelect}
					onShowUnderlay={this.props.onHighlight}
					onHideUnderlay={this.props.onUnhighlight}>
					<View style={styles.textContainer}>
						<Text style={styles.textTitle}>
							{this.props.text.title}
						</Text>
					</View>
				</TouchableElement>
			</View>
		);
	}
}

const styles = StyleSheet.create ( {
	textContainer: {
		flex: 1,
		marginTop: 25
	},
	textTitle: {
		flex: 1,
		fontSize: 16,
		fontWeight: '500',
		paddingLeft: 20,
		paddingBottom: 25
	},
	textFromImage: {
		flex: 1,
		fontSize: 16,
		marginBottom: 2
	},
	imageFileName: {
		flex: 1,
		fontSize: 16,
		marginBottom: 2
	}

} );

module.exports = ImageTextCell;