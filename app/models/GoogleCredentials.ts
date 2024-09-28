import mongoose, { Schema, Document } from "mongoose";
import { Credentials } from "google-auth-library";

interface IGoogleCredentials extends Document, Credentials {
  userId: mongoose.Types.ObjectId;
}

const GoogleCredentialsSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  refresh_token: { type: String },
  expiry_date: { type: Number },
  access_token: { type: String },
  token_type: { type: String },
  id_token: { type: String },
  scope: { type: String },
});

export const GoogleCredentials =
  mongoose.models.GoogleCredentials ||
  mongoose.model<IGoogleCredentials>(
    "GoogleCredentials",
    GoogleCredentialsSchema
  );
