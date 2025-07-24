import { model, Schema } from "mongoose";
import { IAuthProvider, IsActivated, IUser, Role } from "./user.interface";

const authSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerId: { type: String, required: true },
  },
  {
    _id: false,
    versionKey: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String },
    address: { type: String },
    picture: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActivated),
      default: IsActivated.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    auths: [authSchema],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<IUser>("user", userSchema);
