import Express from 'express';
import {getCompaniesStockSymbols} from "./getCompaniesStockSymbols.js";
import {getCompaniesIndustries} from "./getCompaniesIndustries.js";
import {getCompaniesByIndustry} from "./getCompaniesByIndustry.js";
import {getMarketPERatio} from "./getMarketPERatio.js";
import {getWeightedPERatioByIndustryAndYear} from "./getWeightedPERatioByIndustryAndYear.js";

const app = Express.Router();

// API Routes
app.get('/getCompaniesStockSymbols', getCompaniesStockSymbols);
app.get('/getCompaniesIndustries', getCompaniesIndustries);
app.get('/getCompaniesByIndustry', getCompaniesByIndustry);
app.get('/getMarketPERatio', getMarketPERatio);
app.get('/getWeightedPERatioByIndustryAndYear', getWeightedPERatioByIndustryAndYear);

export default app;