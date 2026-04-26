import packageJson from '../../package.json' with { type: 'json' };

export const constants = (app, processEnv = {}) => {
    const {
        COMPANY_ANALYZER_DATA_BASE_URL,
        SUBDIRECTORY,
    } = processEnv;

    /**
     * Service Configuration
     */
    app.set('COMPANY_ANALYZER_DATA_BASE_URL', COMPANY_ANALYZER_DATA_BASE_URL);
    app.set('APP_NAME', packageJson.name);
    app.set('APP_VERSION', packageJson.version);
    app.set('SUBDIRECTORY', SUBDIRECTORY);
};

export default constants;