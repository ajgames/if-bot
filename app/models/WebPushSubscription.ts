import mongoose, { Schema, Document } from "mongoose";

export interface IWebPushSubscription extends Document {
  userId: mongoose.Types.ObjectId;
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const WebPushSubscriptionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    endpoint: {
      type: String,
      required: true,
    },
    keys: {
      p256dh: {
        type: String,
        required: true,
      },
      auth: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const WebPushSubscription =
  mongoose.models.WebPushSubscription ||
  mongoose.model<IWebPushSubscription>(
    "WebPushSubscription",
    WebPushSubscriptionSchema
  );
