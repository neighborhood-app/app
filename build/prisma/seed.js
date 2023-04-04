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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({ log: ['query'] });
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prisma.gender.createMany({
            data: [
                {
                    name: 'male',
                },
                {
                    name: 'female',
                },
            ],
        });
        const bob = yield prisma.user.create({
            data: {
                user_name: 'bob',
                password: 'example',
            },
        });
        const antonina = yield prisma.user.create({
            data: {
                user_name: 'antonina',
                password: 'example',
            },
        });
        const shwetank = yield prisma.user.create({
            data: {
                user_name: 'shwetank',
                password: 'example',
            },
        });
        const radu = yield prisma.user.create({
            data: {
                user_name: 'radu',
                password: 'example',
            },
        });
        const mike = yield prisma.user.create({
            data: {
                user_name: 'mike',
                password: 'example',
            },
        });
        const maria = yield prisma.user.create({
            data: {
                user_name: 'maria',
                password: 'example',
            },
        });
        const bobNeighborhood = yield prisma.neighborhood.create({
            data: {
                admin_id: bob.id,
                name: "Bob's Neighborhood",
            },
        });
        const antoninaNeighborhood = yield prisma.neighborhood.create({
            data: {
                admin_id: antonina.id,
                name: "Antonina's Neighborhood",
            },
        });
        const shwetankNeighborhood = yield prisma.neighborhood.create({
            data: {
                admin_id: shwetank.id,
                name: "Shwetank's Neighborhood",
            },
        });
        yield prisma.neighborhoodUsers.createMany({
            data: [
                {
                    neighborhood_id: bobNeighborhood.id,
                    user_id: radu.id,
                },
                {
                    neighborhood_id: bobNeighborhood.id,
                    user_id: maria.id,
                },
            ],
        });
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
