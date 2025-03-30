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
        "product-table": "SELECT * FROM product;",
        "ingredient-table": "SELECT * FROM ingredients;",
        "add-product": "INSERT INTO product (name, product_cost) VALUES ($1, $2) RETURNING product_id;",
        "employee-names": "SELECT name FROM cashier ORDER BY name;",
        "get-employee-id": "SELECT cashierid FROM cashier WHERE name = $1;",
        "fire-employee": "DELETE FROM cashier WHERE cashierid = $1;",
        "add-employee": "INSERT INTO cashier (name, address, email, phonenumber, password) VALUES ($1, $2, $3, $4, $5) RETURNING cashierid;",
        "cashier-performances": "SELECT c.cashierid, c.name, COUNT(co.order_id) AS total_orders, SUM(co.total_cost) AS total_sales FROM cashier c LEFT JOIN customer_order co ON c.cashierid = co.cashierid GROUP BY c.cashierid, c.name ORDER BY total_sales DESC;",
        "get-manager-creds": "SELECT managerid, name, address, email, phonenumber, password FROM manager WHERE managerid = $1;",
        "get-cashier-creds": "SELECT cashierid, name, address, email, phonenumber, password FROM cashier WHERE cashierid = $1;",

    };
}

module.exports = QueryManager;
