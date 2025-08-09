import { userController } from "./user.controller";
import { validationRequest } from "../../middleware/validation.request";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middleware/check.auth";
import { Role } from "./user.interface";
import { Router } from "express";



const router  = Router();



router.post('/register',validationRequest(createUserZodSchema), userController.createUser);
router.get('/all-users', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), userController.getAllUsers);
router.get('/me', checkAuth(...Object.values(Role)), userController.getMe);
router.patch('/:id',validationRequest(updateUserZodSchema) , checkAuth(...Object.values(Role)), userController.updateUser)

export const userRoutes = router;