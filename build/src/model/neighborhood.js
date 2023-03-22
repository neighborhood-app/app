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
const db_query_1 = __importDefault(require("./db_query"));
class Neighborhood {
    getAllNeighborhoods() {
        return __awaiter(this, void 0, void 0, function* () {
            const GET_ALL_NEIGHBORHOODS = 'SELECT * FROM neighborhoods';
            let result = yield (0, db_query_1.default)(GET_ALL_NEIGHBORHOODS);
            return result;
        });
    }
}
let neighborhood = new Neighborhood();
neighborhood.getAllNeighborhoods().then(res => console.log(res.rows));
exports.default = Neighborhood;
