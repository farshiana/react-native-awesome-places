import React from 'react';
import { TouchableOpacity, TouchableNativeFeedback, Text, View, StyleSheet, Platform } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	button: {
		padding: 10,
		margin: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: 'black',
	},
	disabled: {
		backgroundColor: '#eee',
		borderColor: '#aaa',
	},
	disabledText: {
		color: '#aaa',
	},
});

const buttonWithBackground = (props) => {
	const content = (
		<View style={[
			styles.button,
			{ backgroundColor: props.color },
			props.disabled ? styles.disabled : null,
		]}
		>
			<Text style={props.disabled ? styles.disabledText : null}>{props.children}</Text>
		</View>
	);

	if (props.disabled) {
		return content;
	}

	if (Platform.OS === 'android') {
		return (
			<TouchableNativeFeedback onPress={props.onPress}>
				{content}
			</TouchableNativeFeedback>
		);
	}

	return (
		<TouchableOpacity onPress={props.onPress}>
			{content}
		</TouchableOpacity>
	);
};

buttonWithBackground.propTypes = {
	disabled: PropTypes.bool,
	children: PropTypes.string.isRequired,
	onPress: PropTypes.func.isRequired,
	color: PropTypes.string.isRequired,
};

export default buttonWithBackground;
