import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/check.auth";
import { Role } from "../User/user.interface";
import passport from "passport";

const router = Router();

router.post('/login', authController.credentialLogin)
router.post('/refresh-token', authController.getNewAccessToken)
router.post('/logout', authController.userLogout)
router.post('/reset-password', checkAuth(...Object.values(Role)), authController.resetPassword);
router.get('/google', async(req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '';
    passport.authenticate('google', {scope: ["profile", "email"], state: redirect as string})(req, res, next)
})

router.get('/google/callback',passport.authenticate('google', {failureRedirect: "/login"}), authController.googleCallback)

export const AuthRouter = router;