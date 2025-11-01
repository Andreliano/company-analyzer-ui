import axios from "axios";


export const serviceRequestMiddleware = (req, res, next) => {
    res.locals.serviceRequest = async (opts) => {
        return axios(opts);
    };
    next();
};