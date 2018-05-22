import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
	listItem: {
		flexDirection: 'row',
		width: '100%',
		marginBottom: 5,
		padding: 10,
		backgroundColor: '#eee',
		alignItems: 'center',
	},
	placeImage: {
		marginRight: 8,
		width: 30,
		height: 30,
	},
});

const listItem = props => (
	<TouchableOpacity onPress={props.onItemPressed}>
		<View style={styles.listItem}>
			<Image resizeMode="cover" source={props.placeImage} style={styles.placeImage} />
			<Text>{props.placeName}</Text>
		</View>
	</TouchableOpacity>
);

listItem.propTypes = {
	onItemPressed: PropTypes.func.isRequired,
	placeImage: PropTypes.shape({
		uri: PropTypes.string.isRequired,
	}).isRequired,
	placeName: PropTypes.string.isRequired,
};

export default listItem;
