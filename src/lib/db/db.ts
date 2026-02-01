import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let hasLogged = false;

export const dbConnect = async () => {
	if (mongoose.connection.readyState === 1) {
		return;
	}

	if (!process.env.MONGO_URI) {
		if (!hasLogged) {
			console.warn('MONGO_URI is not defined - skipping database connection');
			hasLogged = true;
		}
		return;
	}

	await mongoose.connect(process.env.MONGO_URI);

	if (!hasLogged) {
		console.log('DB connected');
		hasLogged = true;
	}
};
