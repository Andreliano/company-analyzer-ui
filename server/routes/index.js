import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import api from "./api/index.js";
import pages from "./pages/index.js";
import fourOhFour from "./404.js";
import {webHostMiddleware} from "../middleware/webHost.js";
import {serviceRequestMiddleware} from "../middleware/serviceRequestMiddleware.js";


const app = express.Router();

const apiRoute = `/app/api`;

app.use(cors());

app.use(bodyParser.json());

app.use(serviceRequestMiddleware)

app.use(apiRoute, api);

app.use(webHostMiddleware);

app.use(pages);

app.use(fourOhFour);

export default app;