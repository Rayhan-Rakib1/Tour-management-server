import jwt,{ JwtPayload, SignOptions } from "jsonwebtoken";

export const generateToken = (payload: JwtPayload, secret: string, expiresIn: string) => {
    const token = jwt.sign(payload, secret, {
        expiresIn
    } as SignOptions  );
    return token;
}

export const verifyToken = (token: string, secret: string) => {
    const decoded = jwt.verify(token, secret);
   if (typeof decoded === "string") {
        throw new Error("Invalid token payload type");
    }
    return decoded as JwtPayload
}