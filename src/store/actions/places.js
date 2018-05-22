import { SET_PLACES, REMOVE_PLACE, PLACE_ADDED, START_ADD_PLACE } from './actionTypes';
import { uiStartLoading, uiStopLoading, authGetToken } from './index';

export const startAddPlace = () => ({
	type: START_ADD_PLACE,
});

export const placeAdded = () => ({
	type: PLACE_ADDED,
});

export const addPlace = (name, location, image) => (dispatch) => {
	let authToken;
	dispatch(uiStartLoading());
	dispatch(authGetToken())
		.then((token) => {
			authToken = token;
			return fetch('https://us-central1-awesome-places-71188.cloudfunctions.net/storeImage', {
				method: 'post',
				body: JSON.stringify({
					image: image.base64,
				}),
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
		})
		.catch((error) => {
			console.log(error.toString());
			dispatch(uiStopLoading());
		})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			throw new Error();
		})
		.then((parsedRes) => {
			const placeData = {
				name,
				location,
				image: parsedRes.imageUrl,
				imagePath: parsedRes.imagePath,
			};
			return fetch(`https://awesome-places-71188.firebaseio.com/places.json?auth=${authToken}`, {
				method: 'post',
				body: JSON.stringify(placeData),
			});
		})
		.catch((error) => {
			console.log(error.toString());
			dispatch(uiStopLoading());
		})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			throw new Error();
		})
		.then(() => {
			dispatch(uiStopLoading());
			dispatch(placeAdded());
		});
};

export const setPlaces = places => ({
	type: SET_PLACES,
	places,
});

export const getPlaces = () => (dispatch) => {
	dispatch(authGetToken())
		.then(token => fetch(`https://awesome-places-71188.firebaseio.com/places.json?auth=${token}`))
		.catch(error => console.log(error.toString()))
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			throw new Error();
		})
		.then((parsedRes) => {
			if (parsedRes.error) {
				console.log(parsedRes.error.toString());
			} else {
				const places = Object.keys(parsedRes).map(key => ({
					...parsedRes[key],
					image: {
						uri: parsedRes[key].image,
					},
					key,
				}));
				dispatch(setPlaces(places));
			}
		});
};

export const removePlace = key => ({
	type: REMOVE_PLACE,
	key,
});

export const deletePlace = key => (dispatch) => {
	dispatch(authGetToken())
		.then((token) => {
			dispatch(removePlace(key));
			return fetch(`https://awesome-places-71188.firebaseio.com/places/${key}.json?auth=${token}`, {
				method: 'delete',
			});
		})
		.then((res) => {
			if (res.ok) {
				return res.json();
			}
			throw new Error();
		})
		.catch(error => console.log(error.toString()));
};
