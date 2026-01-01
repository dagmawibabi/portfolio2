import mongoose from 'mongoose';
import { SECRET_MONGO_URI } from '$env/static/private';

let hasLogged = false;

export const dbConnect = async () => {
	if (mongoose.connection.readyState === 1) {
		return;
	}

	if (!SECRET_MONGO_URI) {
		throw new Error('SECRET_MONGO_URI is not defined');
	}

	await mongoose.connect(SECRET_MONGO_URI);

	if (!hasLogged) {
		console.log('DB connected');
		hasLogged = true;
	}
};
