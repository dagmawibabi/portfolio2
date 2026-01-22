import mongoose, { Schema, type InferSchemaType } from 'mongoose';

const RsvpSchema = new Schema(
	{
		fullname: { type: String, required: true },
		email: { type: String, required: true, lowercase: true },
		phone: { type: String },
		occupation: { type: String },
		attendanceType: { type: String, required: true },
		link: { type: String },
		teammates: { type: Array<String>, default: [] },
		isAccepted: { type: Boolean, default: false },
		hasConfirmed: { type: Boolean, default: false }
	},
	{ timestamps: true, collection: 'rsvp2026' }
);

export type Rsvp = InferSchemaType<typeof RsvpSchema>;

export default mongoose.models.Rsvp || mongoose.model<Rsvp>('Rsvp', RsvpSchema);
