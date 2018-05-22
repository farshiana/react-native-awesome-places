import React, { Component } from 'react';
import {
	View,
	Button,
	StyleSheet,
	ScrollView,
	ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { addPlace, startAddPlace } from '../../store/actions/index';
import PlaceInput from '../../components/PlaceInput/PlaceInput';
import MainText from '../../components/UI/MainText/MainText';
import HeadingText from '../../components/UI/HeadingText/HeadingText';
import PickImage from '../../components/PickImage/PickImage';
import PickLocation from '../../components/PickLocation/PickLocation';
import validate from '../../utility/validation';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
	},
});

class SharePlaceScreen extends Component {
	static navigatorStyle = {
		navBarButtonColor: 'orange',
	}

	constructor(props) {
		super(props);
		this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
	}

	componentWillMount() {
		this.reset();
	}

	componentDidUpdate() {
		if (this.props.placeAdded) {
			this.props.navigator.switchToTab({ tabIndex: 0 });
		}
	}

	onNavigatorEvent = (event) => {
		if (event.type === 'ScreenChangedEvent') {
			if (event.id === 'willAppear') {
				this.props.onStartAddPlace();
			}
		} else if (event.type === 'NavBarButtonPress') {
			if (event.id === 'sideDrawerToggle') {
				this.props.navigator.toggleDrawer({
					side: 'left',
				});
			}
		}
	}

	reset = () => {
		this.setState({
			controls: {
				placeName: {
					value: '',
					valid: false,
					touched: false,
					validationRules: {
						notEmpty: true,
					},
				},
				location: {
					value: null,
					valid: false,
				},
				image: {
					value: null,
					valid: false,
				},
			},
		});
	}

	placeNameChangedHandler = (placeName) => {
		this.setState(prevState => ({
			controls: {
				...prevState.controls,
				placeName: {
					...prevState.controls.placeName,
					value: placeName,
					valid: validate(placeName, prevState.controls.placeName.validationRules),
					touched: true,
				},
			},
		}));
	}

	placeAddedHandler = () => {
		this.props.onAddPlace(
			this.state.controls.placeName.value,
			this.state.controls.location.value,
			this.state.controls.image.value,
		);
		this.reset();
		this.imagePicker.reset();
		this.locationPicker.reset();
	}

	locationPickedHandler = (location) => {
		this.setState(prevState => ({
			controls: {
				...prevState.controls,
				location: {
					value: location,
					valid: true,
				},
			},
		}));
	}

	imagePickedHandler = (image) => {
		this.setState(prevState => ({
			controls: {
				...prevState.controls,
				image: {
					value: image,
					valid: true,
				},
			},
		}));
	}

	render = () => {
		let submitButton = (
			<Button
				title="Share the Place!"
				onPress={this.placeAddedHandler}
				disabled={
					!this.state.controls.placeName.valid
					|| !this.state.controls.location.valid
					|| !this.state.controls.image.valid
				}
			/>
		);

		if (this.props.isLoading) {
			submitButton = <ActivityIndicator />;
		}

		return (
			<ScrollView>
				<View style={styles.container}>
					<MainText>
						<HeadingText>
							Share a place with us!
						</HeadingText>
					</MainText>
					<PickImage
						onImagePicked={this.imagePickedHandler}
						ref={(ref) => { this.imagePicker = ref; }}
					/>
					<PickLocation
						onLocationPick={this.locationPickedHandler}
						ref={(ref) => { this.locationPicker = ref; }}
					/>
					<PlaceInput
						placeData={this.state.controls.placeName}
						onChangeText={this.placeNameChangedHandler}
					/>
					<View style={styles.button}>
						{submitButton}
					</View>
				</View>
			</ScrollView>
		);
	}
}

const mapStateToProps = state => ({
	isLoading: state.ui.isLoading,
	placeAdded: state.places.placeAdded,
});

const mapDispatchToProps = dispatch => ({
	onAddPlace: (name, location, image) => dispatch(addPlace(name, location, image)),
	onStartAddPlace: () => dispatch(startAddPlace()),
});

SharePlaceScreen.propTypes = {
	navigator: PropTypes.shape({
		setOnNavigatorEvent: PropTypes.func.isRequired,
		toggleDrawer: PropTypes.func.isRequired,
		switchToTab: PropTypes.func.isRequired,
	}).isRequired,
	onAddPlace: PropTypes.func.isRequired,
	isLoading: PropTypes.bool.isRequired,
	placeAdded: PropTypes.bool.isRequired,
	onStartAddPlace: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);
