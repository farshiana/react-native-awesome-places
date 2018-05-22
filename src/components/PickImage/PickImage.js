import React, { Component } from 'react';
import { View, Image, Button, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center',
	},
	placeholder: {
		borderWidth: 1,
		borderColor: 'black',
		backgroundColor: '#eee',
		width: '80%',
		height: 150,
	},
	button: {
		margin: 8,
	},
	previewImage: {
		width: '100%',
		height: '100%',
	},
});

class PickImage extends Component {
	componentWillMount() {
		this.reset();
	}

	reset() {
		this.setState({
			pickedImage: null,
		});
	}

	pickImageHandler = () => {
		ImagePicker.showImagePicker({
			title: 'Pick an image',
			maxWidth: 800,
			maxHeight: 600,
		}, (res) => {
			if (res.didCancel) {
				console.log('User cancelled');
			} else if (res.error) {
				console.log(res.error.toString());
			} else {
				this.setState({
					pickedImage: res,
				});
				this.props.onImagePicked({
					uri: res.uri,
					base64: res.data,
				});
			}
		});
	}

	render = () => (
		<View style={styles.container}>
			<View style={styles.placeholder}>
				<Image source={this.state.pickedImage} style={styles.previewImage} />
			</View>
			<View style={styles.button}>
				<Button title="Pick Image" onPress={this.pickImageHandler} />
			</View>
		</View>
	)
}

PickImage.propTypes = {
	onImagePicked: PropTypes.func.isRequired,
};

export default PickImage;
