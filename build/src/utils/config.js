"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `${__dirname}/../../.env` });
process.env.POSTGRES_URL = process.env.NODE_ENV === 'development'
    ? process.env.DEV_POSTGRES_URL
    : process.env.TEST_POSTGRES_URL;
exports.default = process.env;
