import express from "express";
import cookieParser from "cookie-parser";
import {createServer} from "./config/createServer.js";
import {loadApp} from "./config/loadApp.js";
import routes from "./routes/index.js";

export const init = async () => {
    // Instantiate the Application
    const app = express();

    // Parser for cookies
    app.use(cookieParser());

    // Load routes
    app.use(routes);

    // Create Server
    await createServer(app);

    return app;
}

// Magic starts here
loadApp(init);

export default init;