

export const webHostMiddleware = (req, res, next) => {
    res.locals.webHost = `${req.protocol}://${req.hostname}:6011`;
    next();
}

export default webHostMiddleware;