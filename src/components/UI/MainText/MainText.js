import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	mainText: {
		color: 'black',
		backgroundColor: 'transparent',
	},
});

const mainText = props => (
	<Text style={styles.mainText}>{props.children}</Text>
);

mainText.propTypes = {
	children: PropTypes.element.isRequired,
};

export default mainText;
