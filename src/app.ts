import express, { Application, Request, Response } from "express";
import cors from "cors";
import { router } from "./app/Routes";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import cookieParser from "cookie-parser";
import passport from "passport";
import expressSession from "express-session";
import "./app/config/passport"
import { envVars } from "./app/config/env";

export const app: Application = express();




app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use(express.json());
app.use(cors());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("server is running ");
});

app.use(globalErrorHandler);
app.use(notFound);
