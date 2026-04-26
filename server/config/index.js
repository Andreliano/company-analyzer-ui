import { expressConfig } from './express.js';
import { constants } from './constants.js';
import { staticAssets } from './staticAssets.js';
import { views } from './views.js';

export const configEntryFile = async (app) => {
    try {
        // Configure Express to work behind a loadbalancer and reverse proxy (Rx3)
        app.set('trust proxy', true);

        // Configure Express and use NonceMiddleware
        expressConfig(app);

        constants(app, process.env);

        // Call function for static assets
        staticAssets(app);

        // Call function for views
        views(app);
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error configuring app: ${error}`);
    }
};

export default configEntryFile;