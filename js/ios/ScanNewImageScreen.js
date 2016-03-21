'use strict';

var React = require ( "react-native" );
var TouchableHighlight = React.TouchableHighlight;
var StyleSheet = React.StyleSheet;
var Animated = React.Animated;
var Dimensions = React.Dimensions;
var Text = React.Text;
var View = React.View;
var DeviceEventEmitter = React.DeviceEventEmitter;

var GLOBAL_SETTINGS = require("./../global");

import Camera from 'react-native-camera';
var RNUploader = require('NativeModules').RNUploader;



var deviceHeight = Dimensions.get ( 'window' ).height;
var cameraHeight = deviceHeight - 150;

class ScanNewImageScreen extends React.Component {
	constructor ( props ) {
		super ( props );
		this.state = {
			offset: new Animated.Value ( deviceHeight ),
			cameraType: Camera.constants.Type.front,
			uploading: false,
			showUploadModal: false,
			uploadProgress: 0,
			uploadTotal: 0,
			uploadWritten: 0,
			uploadStatus: undefined,
			cancelled: false,
			images: []
		};
	}

	componentDidMount () {
		Animated.timing ( this.state.offset, {
			duration: 100,
			toValue: 0
		} ).start ();
		DeviceEventEmitter.addListener('RNUploaderProgress', (data)=>{
			let bytesWritten = data.totalBytesWritten;
			let bytesTotal   = data.totalBytesExpectedToWrite;
			let progress     = data.progress;
			this.setState( { uploadProgress: progress, uploadTotal: bytesTotal, uploadWritten: bytesWritten } );
		});
	}

	render () {
		return (
			<Animated.View
				style={[styles.modal, styles.flexCenter, {transform: [{translateY: this.state.offset}]}]}>
				<Camera
					ref={(cam) => {
						this.camera = cam;
					  }}
					style={styles.preview}
					aspect={Camera.constants.Aspect.fill}>
					<Text style={styles.capture} onPress={this._takePicture.bind(this)}>[SCAN]</Text>
					<Text style={styles.cancel} onPress={this._cancelButtonClicked.bind(this)}>[CANCEL]</Text>
				</Camera>
			</Animated.View>
		);
	}

	_takePicture() {
		this.camera.capture()
			.then((data) => {
				this.state.images.push({uri: data});
				console.log(data); //here data has access to asset library files
				let files = this.state.images.map( (f)=>{
					return {
						name: 'file',
						filename: _generateUUID() + '.png',
						filepath: f.uri,
						filetype: 'image/png'
					}
				});

				console.log(files);
				let opts = {
					url: 'http://52.36.43.235:8080/uploadmobile',
					method: 'POST',
					files: files,                             // optional: POST or PUT
					headers: { 'Accept': 'application/json' },  // optional
				};

				this.setState({ uploading: true, showUploadModal: true});
				RNUploader.upload( opts, ( err, res )=>{
					if( err ){
						console.log(err);
						return;
					}

					let status = res.status;
					let responseString = res.data;

					console.log('upload complete with status ' + status);
					console.log( responseString );
					this.setState( { uploading: false, uploadStatus: status } );
					this.props.closeModal();
				});
			})
			.catch((err) => console.error(err));
	}

	uploadProgressModal(){
		let uploadProgress;

		if( this.state.cancelled ){
			uploadProgress = (
				<View style={{ margin: 5, alignItems: 'center', }}>
					<Text style={{ marginBottom: 10, }}>
						Upload Cancelled
					</Text>
					<TouchableOpacity style={ styles.button } onPress={ this._closeUploadModal.bind(this) }>
						<Text>Close</Text>
					</TouchableOpacity>
				</View>
			);
		}else if( !this.state.uploading && this.state.uploadStatus ){
			uploadProgress = (
				<View style={{ margin: 5, alignItems: 'center', }}>
					<Text style={{ marginBottom: 10, }}>
						Upload complete with status: { this.state.uploadStatus }
					</Text>
					<TouchableOpacity style={ styles.button } onPress={ this._closeUploadModal.bind(this) }>
						<Text>{ this.state.uploading ? '' : 'Close' }</Text>
					</TouchableOpacity>
				</View>
			);
		}else if( this.state.uploading ){
			uploadProgress = (
				<View style={{ alignItems: 'center',  }}>
					<Text style={ styles.title }>Uploading { this.state.images.length } Image{ this.state.images.length == 1 ? '' : 's' }</Text>
					<ActivityIndicatorIOS
						animating={this.state.animating}
						style={[styles.centering, {height: 80}]}
						size="large" />
					<Text>{ this.state.uploadProgress.toFixed(0) }%</Text>
					<Text style={{ fontSize: 11, color: 'gray', marginTop: 5, }}>
						{ ( this.state.uploadWritten / 1024 ).toFixed(0) }/{ ( this.state.uploadTotal / 1024 ).toFixed(0) } KB
					</Text>
					<TouchableOpacity style={ [styles.button, {marginTop: 5}] } onPress={ this._cancelUpload.bind(this) }>
						<Text>{ 'Cancel' }</Text>
					</TouchableOpacity>
				</View>
			);
		}

		return uploadProgress;
	}

	_cancelButtonClicked() {
		this.props.closeModal();
	}

	_scanImage () {
		this.refs.cam.capture ( function ( err, data ) {
			console.log ( err, data );
		} );
	}
}

function _generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (d + Math.random()*16)%16 | 0;
		d = Math.floor(d/16);
		return (c=='x' ? r : (r&0x3|0x8)).toString(16);
	});
	return uuid;
};

const styles = StyleSheet.create ( {
	container: {
		flex: 1
	},
	flexCenter: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	modal: {
		backgroundColor: 'rgba(255, 255, 255, 1.0)',
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	contentContainer: {
		padding: 10,
	},
	preview: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: cameraHeight,
		width: Dimensions.get ( 'window' ).width
	},
	capture: {
		flex: 0,
		backgroundColor: '#fff',
		borderRadius: 5,
		color: '#000',
		padding: 10,
		margin: 5,
		width: 100,
		textAlign: 'center'
	},
	cancel: {
		flex: 0,
		backgroundColor: '#fff',
		borderRadius: 5,
		color: '#000',
		padding: 10,
		margin: 5,
		width: 100,
		textAlign: 'center'
	},
	buttonBar: {
		flexDirection: "row",
		position: "absolute",
		bottom: 25,
		right: 0,
		left: 0,
		justifyContent: "center"
	},
	button: {
		padding: 10,
		color: "#FFFFFF",
		borderWidth: 1,
		borderColor: "#FFFFFF",
		margin: 5
	},
	buttonText: {
		color: "#FFFFFF"
	},
	uploadModal: {
		margin: 50,
		borderWidth: 1,
		borderColor: '#DDD',
		padding: 20,
		borderRadius: 12,
		backgroundColor: 'lightyellow',
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		textAlign: 'center',
		fontWeight: '500',
		fontSize: 14,
	}
} );

module.exports = ScanNewImageScreen;
