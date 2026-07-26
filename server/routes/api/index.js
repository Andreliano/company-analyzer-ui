import Express from 'express';
import {getCompaniesStockSymbols} from "./getCompaniesStockSymbols.js";
import {getCompaniesIndustries} from "./getCompaniesIndustries.js";
import {getCompaniesByIndustry} from "./getCompaniesByIndustry.js";
import {getMarketPERatio} from "./getMarketPERatio.js";
import {getWeightedPERatioByIndustryAndYear} from "./getWeightedPERatioByIndustryAndYear.js";
import {generateIncomeStatementSheet} from "./generateIncomeStatementSheet.js";
import {getIncomeStatementSheet} from "./getIncomeStatementSheet.js";
import {getBatchJobStatus} from "./getBatchJobStatus.js";
import {submitBatchJob} from "./submitBatchJob.js";
import {submitSequentialBatch} from "./submitSequentialBatch.js";
import {getShareDataByTicker} from "./getShareDataByTicker.js";
import {getCompaniesWithIncomeStatements} from "./getCompaniesWithIncomeStatements.js";

const app = Express.Router();

// API Routes
app.get('/getCompaniesStockSymbols', getCompaniesStockSymbols);
app.get('/getCompaniesIndustries', getCompaniesIndustries);
app.get('/getCompaniesByIndustry', getCompaniesByIndustry);
app.get('/getMarketPERatio', getMarketPERatio);
app.get('/getWeightedPERatioByIndustryAndYear', getWeightedPERatioByIndustryAndYear);
app.get('/getIncomeStatementSheet', getIncomeStatementSheet);
app.post('/generateIncomeStatementSheet', generateIncomeStatementSheet);
app.post('/submitBatchJob', submitBatchJob);
app.post('/submitSequentialBatch', submitSequentialBatch);
app.get('/getBatchJobStatus', getBatchJobStatus);
app.get('/getShareDataByTicker', getShareDataByTicker);
app.get('/getCompaniesWithIncomeStatements', getCompaniesWithIncomeStatements);

export default app;