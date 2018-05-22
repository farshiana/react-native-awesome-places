import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	input: {
		width: '100%',
		borderWidth: 1,
		borderColor: '#eee',
		padding: 5,
		marginTop: 8,
		marginBottom: 8,
	},
	invalid: {
		backgroundColor: '#f9c0c0',
		borderColor: 'red',
	},
});

const defaultInput = props => (
	<TextInput
		underlineColorAndroid="transparent"
		{...props}
		style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]}
	/>
);

defaultInput.propTypes = {
	valid: PropTypes.bool.isRequired,
	touched: PropTypes.bool,
};

export default defaultInput;
