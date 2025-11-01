import express from 'express';


const app = express.Router();

app.get(/(.*)/, (req, res, next) => {
   const err = new Error(`A 404 response was received at ${req.originalUrl}`);
   err.status = 404;
   return next(err);
});

export default app;