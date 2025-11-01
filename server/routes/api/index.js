import Express from 'express';
import {getCompaniesStockSymbols} from "./getCompaniesStockSymbols.js";

const app = Express.Router();

// API Routes
app.get('/getCompaniesStockSymbols', getCompaniesStockSymbols);

export default app;