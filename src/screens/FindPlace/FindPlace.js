import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import PlaceList from '../../components/PlaceList/PlaceList';
import { getPlaces } from '../../store/actions/index';

const styles = StyleSheet.create({
	buttonContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	searchButton: {
		borderColor: 'orange',
		borderWidth: 3,
		borderRadius: 50,
		padding: 20,
	},
	searchButtonText: {
		color: 'orange',
		fontWeight: 'bold',
		fontSize: 26,
	},
});

class FindPlaceScreen extends Component {
	static navigatorStyle = {
		navBarButtonColor: 'orange',
	}

	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	}

	state = {
		placesLoaded: false,
		removeAnim: new Animated.Value(1),
		placesAnim: new Animated.Value(0),
	}

	onNavigatorEvent = (event) => {
		if (event.type === 'ScreenChangedEvent') {
			if (event.id === 'willAppear') {
				this.props.onLoadPlaces();
			}
		} else if (event.type === 'NavBarButtonPress') {
			if (event.id === 'sideDrawerToggle') {
				this.props.navigator.toggleDrawer({
					side: 'left',
				});
			}
		}
	}

	itemSelectedHandler = (placeKey) => {
		const place = this.props.places.find(_place => _place.key === placeKey);
		this.props.navigator.push({
			screen: 'react-native-awesome-places.PlaceDetailScreen',
			title: place.name,
			passProps: {
				selectedPlace: place,
			},
		});
	}

	placesSearchHandler = () => {
		Animated.timing(this.state.removeAnim, {
			toValue: 0,
			duration: 500,
			useNativeDriver: true,
		}).start(() => {
			this.setState({
				placesLoaded: true,
			});
			this.placesLoadedHandler();
		});
	}

	placesLoadedHandler = () => {
		Animated.timing(this.state.placesAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}

	render = () => {
		let content = (
			<Animated.View
				style={{
					opacity: this.state.removeAnim,
					transform: [
						{
							scale: this.state.removeAnim.interpolate({
								inputRange: [0, 1],
								outputRange: [12, 1],
							}),
						},
					],
				}}
			>
				<TouchableOpacity onPress={this.placesSearchHandler}>
					<View style={styles.searchButton}>
						<Text style={styles.searchButtonText}>Find Places</Text>
					</View>
				</TouchableOpacity>
			</Animated.View>
		);

		if (this.state.placesLoaded) {
			content = (
				<Animated.View style={{
					opacity: this.state.placesAnim,
				}}
				>
					<PlaceList
						places={this.props.places}
						onItemSelected={this.itemSelectedHandler}
					/>
				</Animated.View>
			);
		}

		return (
			<View style={this.state.placesLoaded ? null : styles.buttonContainer}>
				{content}
			</View>
		);
	}
}

const mapStateToProps = state => ({
	places: state.places.places,
});

const mapDispatchToProps = dispatch => ({
	onLoadPlaces: () => dispatch(getPlaces()),
});

FindPlaceScreen.propTypes = {
	navigator: PropTypes.shape({
		setOnNavigatorEvent: PropTypes.func.isRequired,
		toggleDrawer: PropTypes.func.isRequired,
		push: PropTypes.func.isRequired,
	}).isRequired,
	onLoadPlaces: PropTypes.func.isRequired,
	places: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})).isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(FindPlaceScreen);
