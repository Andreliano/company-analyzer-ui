import Express from 'express';
import {getCompaniesStockSymbols} from "./getCompaniesStockSymbols.js";
import {getCompaniesIndustries} from "./getCompaniesIndustries.js";
import {getCompaniesByIndustry} from "./getCompaniesByIndustry.js";

const app = Express.Router();

// API Routes
app.get('/getCompaniesStockSymbols', getCompaniesStockSymbols);
app.get('/getCompaniesIndustries', getCompaniesIndustries);
app.get('/getCompaniesByIndustry', getCompaniesByIndustry);

export default app;