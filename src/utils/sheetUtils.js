export const buildSheetTableModel = (grid) => {
    if (!Array.isArray(grid) || !grid.length) {
        return { columns: [], rows: [] };
    }
    const [headerRow, ...dataRows] = grid;

    const columns = headerRow.map((header, i) => ({
        field: `c${i}`,
        header: header || '',
        frozen: i === 0,
    }));

    const rows = dataRows.map((row, r) => {
        const obj = { __id: r };
        row.forEach((cell, i) => {
            obj[`c${i}`] = cell;
        });
        return obj;
    });

    return { columns, rows };
};