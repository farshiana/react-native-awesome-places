import React, { Component } from 'react';
import {
	View,
	Image,
	Text,
	StyleSheet,
	TouchableOpacity,
	Platform,
	Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';

import { deletePlace } from '../../store/actions/index';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		margin: 22,
	},
	portraitContainer: {
		flexDirection: 'column',
	},
	landscapeContainer: {
		flexDirection: 'row',
	},
	subContainer: {
		flex: 1,
	},
	placeDetailContainer: {
		flex: 2,
	},
	placeImage: {
		width: '100%',
		height: '100%',
	},
	placeName: {
		fontWeight: 'bold',
		textAlign: 'center',
		fontSize: 28,
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
	deleteButton: {
		alignItems: 'center',
	},
});

class PlaceDetail extends Component {
	constructor(props) {
		super(props);
		Dimensions.addEventListener('change', this.updateStyles);
	}

	state = {
		viewMode: Dimensions.get('window').height > 500 ? 'portrait' : 'landscape',
	}

	componentWillUnmount() {
		Dimensions.removeEventListener('change', this.updateStyles);
	}

	updateStyles = (dims) => {
		this.setState({
			viewMode: dims.window.height > 500 ? 'portrait' : 'landscape',
		});
	}

	deletePlaceHandler = () => {
		this.props.onDeletePlace(this.props.selectedPlace.key);
		this.props.navigator.pop();
	}

	render = () => (
		<View style={[
			styles.container,
			this.state.viewMode === 'portrait'
				? styles.portraitContainer
				: styles.landscapeContainer,
		]}
		>
			<View style={styles.placeDetailContainer}>
				<View style={styles.subContainer}>
					<Image source={this.props.selectedPlace.image} style={styles.placeImage} />
				</View>
				<View style={styles.subContainer}>
					<MapView
						initialRegion={{
							...this.props.selectedPlace.location,
							latitudeDelta: 0.0122,
							longitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.0122,
						}}
						style={styles.map}
					>
						<MapView.Marker coordinate={this.props.selectedPlace.location} />
					</MapView>
				</View>
			</View>
			<View style={styles.subContainer}>
				<View>
					<Text style={styles.placeName}>{this.props.selectedPlace.name}</Text>
				</View>
				<View>
					<TouchableOpacity onPress={this.deletePlaceHandler}>
						<View style={styles.deleteButton}>
							<Icon
								size={32}
								name={Platform.OS === 'android' ? 'md-trash' : 'ios-trash'}
								color="red"
							/>
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

const mapDispatchToProps = dispatch => ({
	onDeletePlace: placeKey => dispatch(deletePlace(placeKey)),
});

PlaceDetail.propTypes = {
	onDeletePlace: PropTypes.func.isRequired,
	selectedPlace: PropTypes.shape({
		key: PropTypes.string.isRequired,
		image: PropTypes.shape({
			uri: PropTypes.string.isRequired,
		}).isRequired,
		location: PropTypes.shape({
			latitude: PropTypes.number.isRequired,
			longitude: PropTypes.number.isRequired,
		}).isRequired,
		name: PropTypes.string.isRequired,
	}).isRequired,
	navigator: PropTypes.shape({
		pop: PropTypes.func.isRequired,
	}).isRequired,
};

export default connect(null, mapDispatchToProps)(PlaceDetail);
