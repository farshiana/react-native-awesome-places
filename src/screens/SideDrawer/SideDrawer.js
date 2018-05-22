import React from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { authLogout } from '../../store/actions/index';

const styles = StyleSheet.create({
	container: {
		paddingTop: 50,
		backgroundColor: 'white',
		flex: 1,
	},
	drawerItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		backgroundColor: '#eee',
	},
	drawerItemIcon: {
		marginRight: 10,
	},
});

const sideDrawer = props => (
	<View
		style={[
			styles.container,
			{ width: Dimensions.get('window').width * 0.8 },
		]}
	>
		<TouchableOpacity onPress={props.onLogout} >
			<View style={styles.drawerItem}>
				<Icon
					name={Platform.OS === 'android' ? 'md-log-out' : 'ios-log-out'}
					size={30}
					color="#aaa"
					style={styles.drawerItemIcon}
				/>
				<Text>Sign Out</Text>
			</View>
		</TouchableOpacity>
	</View>
);

const mapDispatchToProps = dispatch => ({
	onLogout: () => dispatch(authLogout()),
});

sideDrawer.propTypes = {
	onLogout: PropTypes.func.isRequired,
};

export default connect(null, mapDispatchToProps)(sideDrawer);
