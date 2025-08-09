import { Router } from "express";
import { checkAuth } from "../../middleware/check.auth";
import { Role } from "../User/user.interface";
import { validationRequest } from "../../middleware/validation.request";
import {
  createDivisionSchema,
  updateDivisionSchema,
} from "./division.validation";
import { DivisionController } from "./division.controller";
import { multerUploads } from "../../config/multer.config";

const router = Router();

// division routes
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUploads.single("file"),
  validationRequest(createDivisionSchema),
  DivisionController.createDivision
);

router.get("/", DivisionController.getAllDivisions);
router.get("/:slug", DivisionController.getSingleDivision);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(updateDivisionSchema),
  DivisionController.updateDivision
);
router.delete(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  DivisionController.deleteDivision
);

export const divisionRoutes = router;
