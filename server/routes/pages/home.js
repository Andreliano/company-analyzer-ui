import express from 'express';
import { getLocalsForRender } from '../../lib/computeLocals.js';

const app = express.Router();

/**
 * Generic route method to handle incoming connections
 * @param {object} app  - Express app object
 * @returns {null}      - No return value
 */
app.get(/(.*)/, async (req, res) => {
    res.render('index', {
        locals: getLocalsForRender({ req, res }),
    });
});

export default app;