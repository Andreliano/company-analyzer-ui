/* Imports */
import express from 'express';

/**
 * Configure static assets middleware for the Express app.
 * @param {object} app - Express app instance
 * @returns {void}
 */
export const staticAssets = (app) => {
    const {
        SUBDIRECTORY,
        APP_NAME,
        APP_VERSION,
    } = app.settings;

    /**
     * Setup static files.
     */
    app.use(`/${SUBDIRECTORY}/assets`, express.static('dist/assets'));

    app.use((req, res, next) => {
        res.locals.css = `/${SUBDIRECTORY}/assets/${APP_NAME}-v${APP_VERSION}.css`;
        res.locals.js = `/${SUBDIRECTORY}/assets/${APP_NAME}-v${APP_VERSION}.js`;
        res.locals.appVersion = APP_VERSION;
        res.locals.appName = APP_NAME;

        next();
    });
};

export default staticAssets;