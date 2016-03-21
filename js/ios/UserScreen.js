'use strict';

var React = require ( 'react-native' );
var GLOBAL_SETTINGS = require ( "./../global" );
var StyleSheet = React.StyleSheet;
var View = React.View;
var ListView = React.ListView;
var Platform = React.Platform;
var ActivityIndicatorIOS = React.ActivityIndicatorIOS;
var ScrollView = React.ScrollView;
var TouchableHighlight  = React.TouchableHighlight;
var Text = React.Text;

var ImageTextScreen = require ( "./ImageTextScreen" );
var ImageTextCell = require("./ImageTextCell");
var ScanNewImageScreen = require("./ScanNewImageScreen");

class UserScreen extends React.Component {
	constructor ( props ) {
		super ( props );
		this.state = {
			user: this.props.user || { 'token': '123456' },
			isLoading: false,
			dataSource: new ListView.DataSource ( {
				rowHasChanged: ( row1, row2 ) => row1 !== row2
			} ),
			filter: '',
			queryNumber: 0,
			modal: false
		};

		this._renderRow = this._renderRow.bind ( this );
		this._urlForQueryAndPage = this._urlForQueryAndPage.bind ( this );
		this._searchImageTexts = this._searchImageTexts.bind ( this );
		this._renderFooter = this._renderFooter.bind ( this );
		this._renderSeperator = this._renderSeperator.bind ( this );
		this._onEndReached = this._onEndReached.bind ( this );
		this._getDataSource = this._getDataSource.bind ( this );

	}

	componentDidMount () {
		this._searchImageTexts ( 1 );
	}

	_urlForQueryAndPage ( pageNumber:number ) {
		return GLOBAL_SETTINGS.API.API_ENDPOINT + "/users/texts?page=" + pageNumber + "&page_limit=20&token=" + this.state.user.token;
	}

	_searchImageTexts ( query:string ) {
		this.setState ( {
			isLoading: true,
			queryNumber: this.state.queryNumber + 1
		} );

		fetch ( this._urlForQueryAndPage ( 1 ) )
			.then ( ( response )=> response.json () )
			.catch ( ( error ) => {
				this.setState ( {
					isLoading: false,
					dataSource: this._getDataSource ( [] )
				} )
			} )
			.then ( ( responseData ) => {
				this.setState ( {
					isLoading: false,
					dataSource: this._getDataSource ( responseData.texts )
				} )
			} )
			.done ();

	}

	_getDataSource ( imageTexts:Array<any> ):ListView.DataSource {
		return this.state.dataSource.cloneWithRows ( imageTexts );
	}

	_selectRow ( text:Object ) {
		if ( Platform.OS === 'ios' ) {
			this.props.navigator.push ( {
				title: text.title,
				component: ImageTextScreen,
				passProps: { text }
			} );
		} else {
			dismissKeyboard ();
			this.props.navigator.push ( {
				title: text.title,
				name: 'text',
				text: text
			} );
		}
	}

	_renderFooter () {
		if ( Platform.OS === 'ios' ) {
			return <ActivityIndicatorIOS style={styles.scrollSpinner}/>;
		} else {
			return (
				<View style={{alignItems: 'center'}}>
					<ProgressBarAndroid styleAttr="Large"/>
				</View>
			);
		}
	}

	_renderSeperator ( sectionID, rowID, adjacentRowHighlighted ) {
		var style = styles.rowSeparator;
		if ( adjacentRowHighlighted ) {
			style = [ style, styles.rowSeparatorHide ];
		}
		return (
			<View key={'SEP_' + sectionID + '_' + rowID} style={style}/>
		);
	}

	_renderRow ( text, sectionID, rowID, highlightRowFunc ) {
		return (
			<ImageTextCell
				key={text.id}
				onSelect={() => this._selectRow(text)}
				onHighlight={() => highlightRowFunc(sectionID, rowID)}
				onUnhighlight={() => highlightRowFunc(null, null)}
				text={text}
			/>);
	}

	_onEndReached () {
		//this.setState({queryNumber: this.state.queryNumber + 1});
		//fetch(this._urlForQueryAndPage())
		//<TouchableHighlight style={styles.scaNewButtonn} onPress={this._scanNewButtonClicked.bind(this)}>
		//<Text style={styles.buttontext}>+ Scan New Image</Text>
		//</TouchableHighlight>
	}

	render () {
		return (
			<ScrollView contentContainerStyle={styles.contentContainer}>
				<View style={styles.header}>
					<Text style={styles.results}>Results:</Text>
					<TouchableHighlight style={styles.loginbutton} onPress={this._scanNewButtonClicked.bind(this)}>
						<Text style={styles.buttontext}>Scan New Image</Text>
					</TouchableHighlight>
				</View>
				<View style={styles.mainSection}>
					<ListView
						ref="listview"
						renderSeparator={this._renderSeperator}
						dataSource={this.state.dataSource}
						renderFooter={this._renderFooter}
						renderRow={this._renderRow}
						onEndReached={this._onEndReached}
						automaticallyAdjustContentInsets={false}
						keyboardDismissMode="on-drag"
						keyboardShouldPersistTaps={true}
						showsVerticalScrollIndicator={false}
					/>
				</View>
				{this.state.modal ? <ScanNewImageScreen closeModal={() => this.setState({modal: false})}/>: null}
			</ScrollView>
		);
	}

	_scanNewButtonClicked() {
		this.setState({modal: true});
	}
}

const styles = StyleSheet.create ( {
	header : {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	results : {
		flexDirection: 'row',
		fontSize: 15,
		fontWeight: 'bold',
		paddingLeft: 20,
		paddingTop: 10,
		marginTop: 10
	},
	scaNewButtonn: {
		justifyContent: 'flex-end',
		height: 30,
		width: 150,
		padding: 5,
		backgroundColor: 'white',
		alignItems: 'center',
		marginTop: 0,
		flex: 0
	},
	buttontext: {
		color: '#1789d8',
		marginTop: 20
	},
	contentContainer: {
		padding: 10,
		marginTop: 50
	},
	mainSection: {
		flexDirection: 'row'
	},
	container: {
		flex: 1,
		backgroundColor: 'white'
	},
	centerText: {
		alignItems: 'center'
	},
	noText: {
		marginTop: 80,
		color: '#888888'
	},
	separator: {
		height: 1,
		backgroundColor: '#eeeeee'
	},
	scrollSpinner: {
		marginVertical: 20
	},
	rowSeparator: {
		backgroundColor: 'rgba(0, 0, 0, 0.1)',
		height: 1,
		marginLeft: 4
	},
	rowSeparatorHide: {
		opacity: 0.0
	},
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

module.exports = UserScreen;