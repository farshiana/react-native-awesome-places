import React, { Component } from 'react';
import { View, Button, StyleSheet, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	container: {
		width: '100%',
		alignItems: 'center',
	},
	map: {
		width: '100%',
		height: 250,
	},
	button: {
		margin: 8,
	},
});

class PickLocation extends Component {
	componentWillMount() {
		this.reset();
	}

	getLocationHandler = () => {
		navigator.geolocation.getCurrentPosition((pos) => {
			const coordsEvent = {
				nativeEvent: {
					coordinate: pos.coords,
				},
			};
			this.pickLocationHandler(coordsEvent);
		}, (error) => {
			console.log(error.toString());
			alert('Fetching the position failed, please pick one manually');
		});
	}

	reset() {
		this.setState({
			focusedLocation: {
				latitude: 37.7900352,
				longitude: -122.4013726,
				latitudeDelta: 0.0122,
				longitudeDelta: (Dimensions.get('window').width / Dimensions.get('window').height) * 0.0122,
			},
			locationChosen: false,
		});
	}

	pickLocationHandler = (evt) => {
		const coords = evt.nativeEvent.coordinate;
		this.map.animateToRegion({
			...this.state.focusedLocation,
			latitude: coords.latitude,
			longitude: coords.longitude,
		});
		this.setState(prevState => ({
			focusedLocation: {
				...prevState.focusedLocation,
				latitude: coords.latitude,
				longitude: coords.longitude,
			},
			locationChosen: true,
		}));
		this.props.onLocationPick({
			latitude: coords.latitude,
			longitude: coords.longitude,
		});
	}

	render = () => {
		let marker = null;
		if (this.state.locationChosen) {
			marker = <MapView.Marker coordinate={this.state.focusedLocation} />;
		}

		return (
			<View style={styles.container}>
				<MapView
					initialRegion={this.state.focusedLocation}
					region={!this.state.locationChosen ? this.state.focusedLocation : null}
					style={styles.map}
					onPress={this.pickLocationHandler}
					ref={(ref) => { this.map = ref; }}
				>
					{marker}
				</MapView>
				<View style={styles.button}>
					<Button title="Locate Me" onPress={this.getLocationHandler} />
				</View>
			</View>
		);
	}
}

PickLocation.propTypes = {
	onLocationPick: PropTypes.func.isRequired,
};

export default PickLocation;
