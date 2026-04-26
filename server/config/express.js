import express from 'express';

export const expressConfig = (app) => {
    /**
     * Setup Express Router
     * https://expressjs.com/en/guide/routing.html
     */
    app.use(express.Router({
        caseSensitive: app.get('case sensitive routing'),
        strict: app.get('strict routing'),
    }));
};

export default expressConfig;