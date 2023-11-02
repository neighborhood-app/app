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
const bcrypt_1 = __importDefault(require("bcrypt"));
const prismaClient_1 = __importDefault(require("../prismaClient"));
const SAMPLE_PASSWORD = 'secret';
/**
 * Generates a password hash using bcrypt library and 10 salt rounds
 * @param password plain-text password to generate hash
 * @returns Promise resolved to password-hash
 */
const getPasswordHash = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const SALT_ROUNDS = 10;
    const passwordHash = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
    return Promise.resolve(passwordHash);
});
/**
 * connects user to neighborhood in the db
 * @param userId
 * @param neighborhoodId
 */
const connectUsertoNeighborhood = (userId, neighborhoodId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.default.neighborhood.update({
        where: { id: neighborhoodId },
        data: {
            users: {
                connect: { id: userId },
            },
        },
    });
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient_1.default.gender.createMany({
            data: [
                {
                    name: 'male',
                },
                {
                    name: 'female',
                },
            ],
        });
        // Create users
        const bob = yield prismaClient_1.default.user.create({
            data: {
                username: 'bob1234',
                email: 'bob1234@example.com',
                password_hash: yield getPasswordHash(SAMPLE_PASSWORD),
            },
        });
        const antonina = yield prismaClient_1.default.user.create({
            data: {
                username: 'antonina',
                email: 'antonina@example.com',
                password_hash: yield getPasswordHash(SAMPLE_PASSWORD),
            },
        });
        const shwetank = yield prismaClient_1.default.user.create({
            data: {
                username: 'shwetank',
                email: 'shwetank@example.com',
                password_hash: yield getPasswordHash(SAMPLE_PASSWORD),
            },
        });
        const radu = yield prismaClient_1.default.user.create({
            data: {
                username: 'radu',
                email: 'radu@example.com',
                password_hash: yield getPasswordHash(SAMPLE_PASSWORD),
            },
        });
        const mike = yield prismaClient_1.default.user.create({
            data: {
                username: 'mike',
                email: 'mike@example.com',
                password_hash: yield getPasswordHash(SAMPLE_PASSWORD),
            },
        });
        const maria = yield prismaClient_1.default.user.create({
            data: {
                username: 'maria',
                email: 'maria@example.com',
                password_hash: yield getPasswordHash(SAMPLE_PASSWORD),
            },
        });
        const leia = yield prismaClient_1.default.user.create({
            data: {
                username: 'leia',
                email: 'leia@example.com',
                password_hash: yield getPasswordHash(SAMPLE_PASSWORD),
            },
        });
        //---------------------------------------------------------
        // Bob's Neighborhood
        const bobNeighborhood = yield prismaClient_1.default.neighborhood.create({
            data: {
                admin_id: bob.id,
                name: "Bob's Neighborhood",
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
            },
        });
        yield connectUsertoNeighborhood(bob.id, bobNeighborhood.id);
        yield connectUsertoNeighborhood(mike.id, bobNeighborhood.id);
        // The variable will be used in the future when we add responses.
        // eslint-disable-next-line
        const mikeRequest = yield prismaClient_1.default.request.create({
            data: {
                neighborhood_id: bobNeighborhood.id,
                user_id: mike.id,
                title: 'Help moving furniture in apartment',
                content: 'I need help moving my furniture this Saturday',
            },
        });
        yield prismaClient_1.default.request.create({
            data: {
                neighborhood_id: bobNeighborhood.id,
                user_id: mike.id,
                title: 'I need help changing a lightbulb',
                content: 'Can anyone help me with changing the lightbulb this Saturday?',
                status: 'CLOSED',
            },
        });
        yield prismaClient_1.default.request.create({
            data: {
                neighborhood_id: bobNeighborhood.id,
                user_id: mike.id,
                title: 'URGENT My cat fell from the balcony!',
                content: 'Please find Fluffy',
            },
        });
        yield prismaClient_1.default.request.create({
            data: {
                neighborhood_id: bobNeighborhood.id,
                user_id: mike.id,
                title: 'I can\'t cook. Help!',
                content: 'I need someone to cook breakfast and dinner for me everyday. I don\'t want to pay anything btw.',
            },
        });
        //---------------------------------------------------------
        // Antonina's Neighborhood
        const antoninaNeighborhood = yield prismaClient_1.default.neighborhood.create({
            data: {
                admin_id: antonina.id,
                name: "Antonina's Neighborhood",
            },
        });
        yield connectUsertoNeighborhood(antonina.id, antoninaNeighborhood.id);
        yield connectUsertoNeighborhood(radu.id, antoninaNeighborhood.id);
        yield connectUsertoNeighborhood(maria.id, antoninaNeighborhood.id);
        yield connectUsertoNeighborhood(leia.id, antoninaNeighborhood.id);
        // The variable will be used in the future when we add responses.
        // eslint-disable-next-line
        const raduRequest = yield prismaClient_1.default.request.create({
            data: {
                neighborhood_id: antoninaNeighborhood.id,
                user_id: radu.id,
                title: 'Plant trees',
                content: 'I want to plant some trees in the rezidential area this Sunday. Who wants to help?',
            },
        });
        // The variable will be used in the future when we add responses.
        // eslint-disable-next-line
        const mariaRequest = yield prismaClient_1.default.request.create({
            data: {
                neighborhood_id: antoninaNeighborhood.id,
                user_id: maria.id,
                title: 'Install washing machine',
                content: 'Can anyone help me install a washing machine?',
            },
        });
        yield prismaClient_1.default.response.create({
            data: {
                request_id: raduRequest.id,
                user_id: antonina.id,
                content: 'I can help out',
                status: 'PENDING',
            },
        });
        yield prismaClient_1.default.response.create({
            data: {
                request_id: raduRequest.id,
                user_id: leia.id,
                content: 'I can also help out',
                status: 'PENDING',
            },
        });
        //---------------------------------------------------------
        // Shwetank's Neighborhood
        const shwetankNeighborhood = yield prismaClient_1.default.neighborhood.create({
            data: {
                admin_id: shwetank.id,
                name: "Shwetank's Neighborhood",
            },
        });
        yield connectUsertoNeighborhood(shwetank.id, shwetankNeighborhood.id);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prismaClient_1.default.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prismaClient_1.default.$disconnect();
    process.exit(1);
}));
