import es6Renderer from 'express-es6-template-engine';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const views = (app) => {
    app.engine('html', es6Renderer);
    // Custom views directory.  Default is at the directory root
    app.set('views', path.resolve(dirname, '../views'));
    app.set('view engine', '.html');
    app.enable('view cache');
};

export default views;