import { Router } from "express";
import { checkAuth } from "../../middleware/check.auth";
import { Role } from "../User/user.interface";
import { validationRequest } from "../../middleware/validation.request";
import { createDivisionSchema, updateDivisionSchema } from "./division.validation";
import { divisionController } from "./division.controller";

const router = Router();


// division routes
router.post('/create', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validationRequest(createDivisionSchema), divisionController.createDivision);

router.get('/', divisionController.getAllDivision);
router.get('/:slug', divisionController.getSingleDivision);
router.patch('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), validationRequest(updateDivisionSchema),divisionController.updatedDivision);
router.delete('/:id', checkAuth(Role.ADMIN, Role.SUPER_ADMIN), divisionController.deleteDivision)

export const divisionRoutes = router;