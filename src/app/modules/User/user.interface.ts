import { Types } from "mongoose";

export interface IAuthProvider {
  provider: 'google' | 'credential';
  providerId: string;
}

export enum IsActivated {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}
export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDES = "GUIDES",
}
export interface IUser {
    _id?: Types.ObjectId
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: IsActivated;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[]
    bookings?: Types.ObjectId[]
    guides?: Types.ObjectId[]
}
