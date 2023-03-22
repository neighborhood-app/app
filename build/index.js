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
const express_1 = __importDefault(require("express"));
const neighborhood_1 = __importDefault(require("./src/model/neighborhood"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = 3000;
app.get('/', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.get('/neighborhoods', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const neighborhoods = yield new neighborhood_1.default().getAllNeighborhoods();
    if (!neighborhoods)
        return res.sendStatus(404);
    return res.json(neighborhoods);
}));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
