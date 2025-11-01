import Express from 'express';
import home from "./home.js";
import {serviceRequestMiddleware} from "../../middleware/serviceRequestMiddleware.js";

const app = Express.Router();

app.use('/app', serviceRequestMiddleware, home);

export default app;