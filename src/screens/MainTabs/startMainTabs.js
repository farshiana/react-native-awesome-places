import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const startTabs = () => {
	Promise.all([
		Icon.getImageSource(Platform.OS === 'android' ? 'md-map' : 'ios-map', 30),
		Icon.getImageSource(Platform.OS === 'android' ? 'md-share-alt' : 'ios-share-alt', 30),
		Icon.getImageSource(Platform.OS === 'android' ? 'md-menu' : 'ios-menu', 30),
	]).then((sources) => {
		Navigation.startTabBasedApp({
			tabs: [
				{
					screen: 'react-native-awesome-places.FindPlaceScreen',
					label: 'Find Place',
					title: 'Find Place',
					icon: sources[0],
					navigatorButtons: {
						leftButtons: [
							{
								icon: sources[2],
								title: 'Menu',
								id: 'sideDrawerToggle',
							},
						],
					},
				},
				{
					screen: 'react-native-awesome-places.SharePlaceScreen',
					label: 'Share Place',
					title: 'Share Place',
					icon: sources[1],
					navigatorButtons: {
						leftButtons: [
							{
								icon: sources[2],
								title: 'Menu',
								id: 'sideDrawerToggle',
							},
						],
					},
				},
			],
			tabsStyle: {
				tabBarSelectedButtonColor: 'orange', // for ios
			},
			drawer: {
				left: {
					screen: 'react-native-awesome-places.SideDrawerScreen',
				},
			},
			appStyle: {
				tabBarSelectedButtonColor: 'orange', // for android
			},
		});
	});
};

export default startTabs;
