export const getLocalsForRender = ({
                                       req,
                                       res,
                                       opts = {},
                                       useDefault = true,
                                   }) => {
    if ((!req || !res) && useDefault) throw new Error('No req or res object to configure defaults');

    const {settings} = req.app ?? {};

    const defaultLocals = useDefault
        ? {
            wcsContent: res.locals.wcsElements,
            css: res.locals.css,
            js: res.locals.js,
            nonce: res.locals.nonce,
            appData: `<script nonce="${res.locals.nonce}">const appData = ${JSON.stringify({
                subdirectory: 'app',
            })};</script>`,
            webHost: res.locals.webHost,
        }
        : {};

    return {...defaultLocals, ...opts};
};

export default getLocalsForRender;