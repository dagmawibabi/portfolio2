import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const PassSchema = new Schema(
	{
		fullname: { type: String, required: true, trim: true },
		email: { type: String, required: true, lowercase: true, trim: true, unique: true },
		phone: { type: String, required: true, trim: true },
		occupation: { type: String, required: true, trim: true },
		attendanceType: {
			type: String,
			required: true,
			enum: ['Attending', 'Speaking', 'Showcasing', 'Volunteering']
		},
		link: { type: String, default: '' },
		note: { type: String, default: '' },
		status: {
			type: String,
			enum: ['pending', 'approved', 'declined'],
			default: 'pending'
		},
		program: { type: String, default: '' },
		ticket: { type: String, required: true, unique: true },
		accessKey: { type: String, required: true }
	},
	{ timestamps: true, collection: 'meetupPasses' }
);

export type MeetupPass = InferSchemaType<typeof PassSchema> & { _id: mongoose.Types.ObjectId };

export default mongoose.models.MeetupPass || mongoose.model('MeetupPass', PassSchema);
