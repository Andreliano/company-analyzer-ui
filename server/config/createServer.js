export const createServer = async (app) => {
    const port = process.env.PORT || 3000;
    app.listen(port);
}