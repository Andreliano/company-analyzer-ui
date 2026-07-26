

export const webHostMiddleware = (req, res, next) => {
    res.locals.webHost = `http://localhost:5173`;
    next();
}

export default webHostMiddleware;