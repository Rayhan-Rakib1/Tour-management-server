import { StatusCodes } from "http-status-codes";
import { envVars } from "../config/env";
import AppError from "../ErrorHandlers/AppError";
import { User } from "../modules/User/user.model";
import bcrypt from "bcryptjs";
import { IAuthProvider, IUser, Role } from "../modules/User/user.interface";

export const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExist = await User.findOne({
      email: envVars.SUPER_ADMIN_EMAIL,
    });

    if (isSuperAdminExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, "Super admin already exists");
    }

    const hashPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credential",
      providerId: envVars.SUPER_ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "super admin",
      role: Role.SUPER_ADMIN,
      email: envVars.SUPER_ADMIN_EMAIL,
      password: hashPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const superAdmin = await User.create(payload);

    console.log(superAdmin);
  } catch (error) {
   console.log(error);
  }
};
