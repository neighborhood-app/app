"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const config_1 = __importDefault(require("../utils/config"));
// should be moved to logger module
const logQuery = (statement, parameters) => {
    const timeStamp = new Date();
    const formattedTimeStamp = timeStamp.toString().substring(4, 24);
    console.log(formattedTimeStamp, statement, parameters);
};
function dbQuery(statement, ...parameters) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(config_1.default.POSTGRES_URL); //REMOVE AFTER TESTING
        const client = new pg_1.Client(config_1.default.POSTGRES_URL);
        yield client.connect();
        logQuery(statement, parameters);
        const result = yield client.query(statement, parameters);
        yield client.end();
        return result;
    });
}
exports.default = dbQuery;
