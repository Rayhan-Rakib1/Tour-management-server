import { Router } from "express";
import { userRoutes } from "../modules/User/user.routes";
import { AuthRouter } from "../modules/Auth/auth.route";
import { tourRoutes } from "../modules/Tour/tour.route";
import { divisionRoutes } from "../modules/division/division.route";

export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: AuthRouter
    },{
        path: '/tour',
        route: tourRoutes
    },
    {
        path: '/division',
        route: divisionRoutes
    }
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})