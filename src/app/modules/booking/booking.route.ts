import { Router } from "express";
import { checkAuth } from "../../middleware/check.auth";
import { Role } from "../User/user.interface";
import { validationRequest } from "../../middleware/validation.request";
import { createBookingZodSchema, updateBookingStatusZodSchema } from "./booking.validation";

const router = Router();

router.post('/', checkAuth(...Object.values(Role)), validationRequest(createBookingZodSchema));
router.get('/', checkAuth(Role.ADMIN, Role.SUPER_ADMIN));
router.get("/my-bookings", checkAuth(...Object.values(Role)));
router.get("/:bookingId", checkAuth(...Object.values(Role)));
router.patch("/:bookingId/status", checkAuth(...Object.values(Role)), validationRequest(updateBookingStatusZodSchema));


export const bookingRoutes = router;