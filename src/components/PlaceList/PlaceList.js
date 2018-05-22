import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

import ListItem from '../ListItem/ListItem';

const styles = StyleSheet.create({
	listContainer: {
		width: '100%',
	},
});

const placeList = props => (
	<FlatList
		style={styles.listContainer}
		data={props.places}
		renderItem={info => (
			<ListItem
				key={info.item.key}
				placeName={info.item.name}
				placeImage={info.item.image}
				onItemPressed={() => props.onItemSelected(info.item.key)}
			/>
		)}
	/>
);

placeList.propTypes = {
	places: PropTypes.arrayOf(PropTypes.shape({
		key: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
	})).isRequired,
	onItemSelected: PropTypes.func.isRequired,
};

export default placeList;
