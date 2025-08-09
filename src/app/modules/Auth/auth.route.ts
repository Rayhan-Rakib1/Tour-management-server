import { NextFunction, Request, Response, Router } from "express";
import { authController } from "./auth.controller";
import { checkAuth } from "../../middleware/check.auth";
import { Role } from "../User/user.interface";
import passport from "passport";
import { envVars } from "../../config/env";

const router = Router();

router.post('/login', authController.credentialLogin)
router.post('/refresh-token', authController.getNewAccessToken)
router.post('/logout', authController.userLogout)
router.post('/reset-password', checkAuth(...Object.values(Role)), authController.resetPassword);
router.post('/set-password', checkAuth(...Object.values(Role)), authController.setPassword);
router.post('/forget-password',  authController.forgetPassword);
router.post('/change-password', checkAuth(...Object.values(Role)), authController.changePassword);
router.get('/google', async(req: Request, res: Response, next: NextFunction) => {
    const redirect = req.query.redirect || '';
    passport.authenticate('google', {scope: ["profile", "email"], state: redirect as string})(req, res, next)
})

router.get('/google/callback',passport.authenticate('google',  {failureRedirect: `${envVars.FRONTEND_URL}/login?error=There is some issues with your account. Please contact with out support team!` }), authController.googleCallback)

export const AuthRouter = router;