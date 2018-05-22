import { AsyncStorage } from 'react-native';

import { AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from './actionTypes';
import { uiStartLoading, uiStopLoading } from './index';
import startMainTabs from '../../screens/MainTabs/startMainTabs';
import App from '../../../App';

const API_KEY = 'AIzaSyDBb1LmkDMNP7vofXC7PryFEOMBmbfJtuA';

export const authSetToken = (token, expirationDate) => ({
	type: AUTH_SET_TOKEN,
	token,
	expirationDate,
});

export const authStoreToken = (token, expiresIn, refreshToken) => (dispatch) => {
	const now = new Date();
	const expirationDate = now.getTime() + (expiresIn * 1000);
	dispatch(authSetToken(token, expirationDate));
	AsyncStorage.setItem('ap:auth:token', token);
	AsyncStorage.setItem('ap:auth:expirationDate', expirationDate.toString());
	AsyncStorage.setItem('ap:auth:refreshToken', refreshToken);
};

export const tryAuth = (authData, authMode) => (dispatch) => {
	dispatch(uiStartLoading());

	let url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=${API_KEY}`;
	if (authMode === 'signup') {
		url = `https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=${API_KEY}`;
	}

	fetch(url, {
		method: 'post',
		body: JSON.stringify({
			...authData,
			returnSecureToken: true,
		}),
		headers: {
			'Content-Type': 'application/json',
		},
	})
		.catch((error) => {
			console.log(error.toString());
			dispatch(uiStopLoading());
		})
		.then(res => res.json())
		.then((parsedRes) => {
			dispatch(uiStopLoading());
			if (!parsedRes.idToken) {
				console.log(parsedRes.error.toString());
			} else {
				dispatch(authStoreToken(
					parsedRes.idToken,
					parsedRes.expiresIn,
					parsedRes.refreshToken,
				));
				startMainTabs();
			}
		});
};

export const authClearStorage = () => () => {
	AsyncStorage.removeItem('ap:auth:token');
	AsyncStorage.removeItem('ap:auth:expirationDate');
	return AsyncStorage.removeItem('ap:auth:refreshToken');
};

export const authGetToken = () => (dispatch, getState) => (
	new Promise((resolve, reject) => {
		const { token } = getState().auth;
		const { expirationDate } = getState().auth;
		if (token && new Date(expirationDate) > new Date()) {
			resolve(token);
		} else {
			let fetchedToken;
			AsyncStorage.getItem('ap:auth:token')
				.then((tokenFromStorage) => {
					fetchedToken = tokenFromStorage;
					if (!tokenFromStorage) {
						reject();
						return;
					}
					return AsyncStorage.getItem('ap:auth:expirationDate');
				})
				.then((expirationDateFromStorage) => {
					const parsedExpirationDate = new Date(parseInt(expirationDateFromStorage, 10));
					const now = new Date();
					if (parsedExpirationDate > now) {
						dispatch(authSetToken(fetchedToken));
						resolve(fetchedToken);
					} else {
						reject();
					}
				})
				.catch(() => reject(new Error('No valid token found')));
		}
	}).catch(() => (
		AsyncStorage.getItem('ap:auth:refreshToken')
			.then(refreshToken => (
				fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
					method: 'post',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
					body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
				})
			))
			.then(res => res.json())
			.then((parsedRes) => {
				if (parsedRes.id_token) {
					dispatch(authStoreToken(
						parsedRes.idToken,
						parsedRes.espiresIn,
						parsedRes.refreshToken,
					));
					return parsedRes.id_token;
				}
				dispatch(authClearStorage());
			})
	))
		.then((token) => {
			if (token) {
				return token;
			}
			throw new Error('No valid token');
		})
);

export const authAutoSignin = () => (dispatch) => {
	dispatch(authGetToken())
		.then(() => {
			startMainTabs();
		})
		.catch(() => console.log('Failed to fetch token!'));
};

export const authRemoveToken = () => ({
	type: AUTH_REMOVE_TOKEN,
});

export const authLogout = () => (dispatch) => {
	dispatch(authClearStorage())
		.then(App);
	dispatch(authRemoveToken());
};
