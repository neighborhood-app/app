"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const { DATABASE_URL, PORT } = process.env;
exports.default = { DATABASE_URL, PORT };
