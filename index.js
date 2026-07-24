const express = require('express');
const app =express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo API",
            version: "1.0.0",
        },
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
const todo_routes = require("./routes/todo");
app.use("/todo", todo_routes);