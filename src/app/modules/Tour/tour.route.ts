import { Router } from "express";
import { checkAuth } from "../../middleware/check.auth";
import { Role } from "../User/user.interface";
import { validationRequest } from "../../middleware/validation.request";
import {
  createTourTypesZodSchema,
  createTourZodSchema,
  updateTourZodSchema,
} from "./tour.validation";
import { tourController } from "./tour.controller";
import { multerUploads } from "../../config/multer.config";

const router = Router();

// tour-types routes
router.get("/tour-types", tourController.getAllTourTypes);
router.post(
  "/create-tour-types",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypesZodSchema),
  tourController.createTourType
);
router.patch(
  "/tour-types/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  validationRequest(createTourTypesZodSchema),
  tourController.updateTourType
);

router.delete("/tour-types/:id", tourController.deleteTourType);

// tour routes
router.get("/", tourController.getAllTours);
router.post(
  "/create",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUploads.array("files"),
  validationRequest(createTourZodSchema),
  tourController.createTour
);
router.patch(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  multerUploads.array("files"),
  validationRequest(updateTourZodSchema),
  tourController.updateTour
);
router.delete("/:id", tourController.deleteTour);

export const tourRoutes = router;
