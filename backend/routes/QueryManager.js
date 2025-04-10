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
        "sales-report": `
            SELECT
                p.name AS product_name,
                SUM(cp.quantity) AS total_quantity_sold,
                SUM(cp.quantity * p.product_cost::numeric) AS total_sales
            FROM customer_order co
            JOIN customer_product cp ON co.order_id = cp.order_id
            JOIN product p ON cp.product_id = p.product_id
            WHERE co.datetime BETWEEN $1 AND $2
            GROUP BY p.name
            ORDER BY p.name;
        `,
        "x-report-sales": `
            SELECT
            EXTRACT(HOUR FROM datetime)::int AS hour, 
            SUM(total_cost::numeric) AS sales
            FROM customer_order
            WHERE datetime::date = $1
            AND EXTRACT(HOUR FROM datetime)::int <= $2
            GROUP BY hour
            ORDER BY hour;
        `,
        "x-report-adjustments": `
            SELECT
            SUM("return"::numeric) AS returns,
            SUM("void"::numeric) AS voids,
            SUM(discard::numeric) AS discards
            FROM customer_order
            WHERE datetime::date = $1
            AND EXTRACT(HOUR FROM datetime)::int <= $2;
        `,
        "x-report-payment-methods": `
            SELECT payment_method, SUM(total_cost::numeric) AS total
            FROM customer_order
            WHERE datetime::date = $1
            AND EXTRACT(HOUR FROM datetime)::int <= $2
            GROUP BY payment_method;
        `,
        "z-report-sales-tax": `
            SELECT COALESCE(SUM(CAST(total_cost AS numeric)), 0) AS sales,
                   COALESCE(SUM(CAST(total_cost AS numeric) * tax_rate), 0) AS total_tax
            FROM customer_order
            WHERE CAST(datetime AS date) BETWEEN $1 AND $2;
        `,
        "z-report-payment-methods": `
            SELECT payment_method,
                   COALESCE(SUM(CAST(total_cost AS numeric)), 0) AS amount
            FROM customer_order
            WHERE CAST(datetime AS date) BETWEEN $1 AND $2
            GROUP BY payment_method
        `,
        "z-report-adjustments": `
            SELECT COALESCE(SUM(CAST(discount AS numeric)), 0) AS discounts,
                   COALESCE(SUM(CAST("void" AS numeric)), 0) AS voids,
                   COALESCE(SUM(CAST(service_charge AS numeric)), 0) AS service_charges
            FROM customer_order
            WHERE CAST(datetime AS date) BETWEEN $1 AND $2;
        `,
        "z-report-manager-names": `
            SELECT name FROM manager;
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
        "add-product": "INSERT INTO product (name, product_cost, category, imgurl) VALUES ($1, $2, $3, $4) RETURNING product_id;",
        "employee-names": "SELECT name FROM cashier ORDER BY name;",
        "get-employee-id": "SELECT cashierid FROM cashier WHERE name = $1;",
        "fire-employee": "DELETE FROM cashier WHERE cashierid = $1;",
        "add-employee": "INSERT INTO cashier (name, address, email, phonenumber, password) VALUES ($1, $2, $3, $4, $5) RETURNING cashierid;",
        "cashier-performances": "SELECT c.cashierid, c.name, COUNT(co.order_id) AS total_orders, SUM(co.total_cost) AS total_sales FROM cashier c LEFT JOIN customer_order co ON c.cashierid = co.cashierid GROUP BY c.cashierid, c.name ORDER BY total_sales DESC;",
        "get-manager-creds": "SELECT managerid, name, address, email, phonenumber, password FROM manager WHERE managerid = $1;",
        "get-cashier-creds": "SELECT cashierid, name, address, email, phonenumber, password FROM cashier WHERE cashierid = $1;",
        "get-ingredient-information": "SELECT ingredientid, cost, name, quantity FROM ingredients WHERE LOWER(name) = LOWER($1);",
        "add-ingredient": "INSERT INTO ingredients (name, cost, quantity) VALUES ($1, $2, $3) RETURNING ingredientid;",
        "last-10-orders": "SELECT * FROM customer_order ORDER BY order_id DESC LIMIT 10;",
        "get-product-information": "SELECT product_id, name, product_cost FROM product WHERE LOWER(name) = LOWER($1);"
    };
}

module.exports = QueryManager;
