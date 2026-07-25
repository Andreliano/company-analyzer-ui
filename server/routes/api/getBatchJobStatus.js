export const getBatchJobStatus = async (req, res) => {
    const { jobId } = req.query;

    const opts = {
        method: "GET",
        url: `${req.app.settings.COMPANY_ANALYZER_PROCESS_BASE_URL}/batch/income-statements/jobs/${jobId}/status`,
    };

    try {
        const results = (await res.locals.serviceRequest(opts))?.data;
        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: error?.message });
    }
};