class QueryManager {
    static queries = {
        "product-usage-chart": `
            WITH product_usage AS (
                SELECT
                    pi.ingredientid,
                    SUM(cp.quantity * pi.quantity_required) AS total_used
                FROM customer_order co
                         JOIN customer_product cp ON co.order_id = cp.order_id
                         JOIN product_ingredient pi ON cp.product_id = pi.product_id
                WHERE co.datetime BETWEEN $1 AND $2
                GROUP BY pi.ingredientid
            )
            SELECT
                i.name AS ingredient_name,
                pu.total_used
            FROM product_usage pu
                     JOIN ingredients i ON pu.ingredientid = i.ingredientid
            ORDER BY i.name;
        `,
        "debug-tables": `
            SELECT
                table_name,
                column_name,
                data_type
            FROM
                information_schema.columns
            WHERE
                table_schema = 'public' -- Adjust if necessary for other schemas
            ORDER BY
                table_name, ordinal_position;
        `,
        "debug-connection": "SELECT 1;",
        // Add more queries here
    };
}

module.exports = QueryManager;
