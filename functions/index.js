/* eslint global-require: off */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const fs = require('fs');
const gcs = require('@google-cloud/storage')({
	projectId: 'awesome-places-71188',
	keyFilename: 'awesome-places.json',
});
const UUID = require('uuid-v4');

admin.initializeApp({
	credential: admin.credential.cert(require('./awesome-places.json')),
});

exports.storeImage = functions.https.onRequest((request, response) => {
	cors(request, response, () => {
		if (!request.headers.authorization || !request.headers.authorization.startsWith('Bearer ')) {
			console.log('No token present');
			response.status(403).send({ error: 'Unauthorized' });
			return;
		}

		const idToken = request.headers.authorization.split('Bearer ')[1];
		admin.auth().verifyIdToken(idToken)
			.then(() => {
				const body = JSON.parse(request.body);
				fs.writeFileSync('/tmp/uploaded-image.jpg', body.image, 'base64', (error) => {
					if (error) {
						console.log(error.toString());
						return response.status(500).json({ error });
					}
				});

				const bucket = gcs.bucket('gs://awesome-places-71188.appspot.com');
				const uuid = UUID();
				bucket.upload('/tmp/uploaded-image.jpg', {
					uploadType: 'media',
					destination: `/places/${uuid}.jpg`,
					metadata: {
						metadata: {
							contentType: 'image/jpeg',
							firebaseStorageDownloadTokens: uuid,
						},
					},
				}, (error, file) => {
					if (error) {
						console.log(error.toString());
						return response.status(500).json({ error });
					}
					response.status(201).json({
						imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${uuid}`,
						imagePath: `/places/${uuid}.jpg`,
					});
				});
			})
			.catch(() => {
				console.log('Token is invalid');
				response.status(403).send({ error: 'Unauthorized' });
			});
	});
});

exports.deleteImage = functions.database
	.ref('/places/{placeId}')
	.onDelete((event) => {
		const placeData = event.data.previous.val();
		const { imagePath } = placeData;

		const bucket = gcs.bucket('gs://awesome-places-71188.appspot.com');
		return bucket.file(imagePath).delete();
	});
