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
const client_1 = require("@prisma/client");
const app_1 = __importDefault(require("../../app"));
const seed_1 = __importDefault(require("./seed"));
const supertest = require('supertest'); // eslint-disable-line
// 'require' was used because supertest does not support import
const prisma = new client_1.PrismaClient();
const request = supertest(app_1.default);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, seed_1.default)();
}));
describe('Testing GET method for neighborhood API.', () => {
    test('All neighborhoods are returned', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield request.get('/neighborhoods');
        expect(response.status).toEqual(200);
        expect(response.body.length).toEqual(3);
    }));
    test('If no neighborhoods, return status 404', () => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.neighborhood.deleteMany({});
        const response = yield request.get('/neighborhoods');
        expect(response.status).toEqual(404);
    }));
});
