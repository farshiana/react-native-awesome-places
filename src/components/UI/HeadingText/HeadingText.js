import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	textHeading: {
		fontSize: 28,
		fontWeight: 'bold',
	},
});

const headingText = props => (
	<Text {...props} style={[styles.textHeading, props.style]}>{props.children}</Text>
);

headingText.propTypes = {
	children: PropTypes.string.isRequired,
};

export default headingText;
