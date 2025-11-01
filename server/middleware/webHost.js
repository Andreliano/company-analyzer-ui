

export const webHostMiddleware = (req, res, next) => {
    res.locals.webHost = `${req.protocol}://${req.hostname}3000`;
}