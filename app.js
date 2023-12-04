
const logger = require('./logger/my_logger')
const path = require('path')
const express = require('express')
const body_parser = require('body-parser')

const employee_router = require('./routers/employee_router')

logger.info('==== System start =======')

const app = express()
const port = 3000
app.use(body_parser.json())
app.use(express.static(path.join('.', '/static/')))
const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

app.listen(3000, () => {
    logger.info('==== Server started =======')
    console.log('Express server is running ....');
})

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "My REST API employee",
        },
        servers: [
            {
                url: "https://my-cloud1.onrender.com/",
            },
        ],
    },
    apis: ["./routers/*.js"],
};

const specs = swaggerJsdoc(options);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use('/api/employee', employee_router)

logger.info('==== System stop =======')