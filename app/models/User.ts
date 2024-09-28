import mongoose, { Schema, Document } from "mongoose";

interface IUser extends Document {
  email: string;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
