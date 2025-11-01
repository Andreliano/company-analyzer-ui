
export const getCompaniesStockSymbols = async (req, res) => {
    const opts = {
        method: "GET",
        url: `http://localhost:8082/company-analyzer-data-services/companies/stock-symbols`
    };

    try {
        const results = (await res.locals.serviceRequest(opts))?.data;

        return res.status(200).json(results);
    } catch (error) {
        return res.status(500).json({ error: error?.message });
    }
}