import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let hasLogged = false;

export const dbConnect = async () => {
	if (mongoose.connection.readyState === 1) {
		return;
	}

	if (!process.env.MONGO_URI) {
		// Don't throw - just skip connection if MONGO_URI is not set
		// This allows the app to run without MongoDB for pages that don't need it
		if (!hasLogged) {
			console.log('MONGO_URI not set - skipping database connection');
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
