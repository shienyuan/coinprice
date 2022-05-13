"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCryptoAlgolia = exports.syncCryptoMetadata = exports.syncCryptos = exports.convert = exports.getCryptos = void 0;
const firebase_1 = require("./utils/firebase");
const convert_1 = require("./convert");
const cryptos_1 = require("./cryptos");
exports.getCryptos = firebase_1.fn.onCall(async (_, { app }) => {
    authCheck(app);
    return await (0, cryptos_1.getCryptosFunc)();
});
exports.convert = firebase_1.fn.onCall(async (req, { app }) => {
    authCheck(app);
    return await (0, convert_1.default)(req);
});
exports.syncCryptos = firebase_1.fn.onCall(async (_, { app }) => {
    authCheck(app);
    return await (0, cryptos_1.syncCryptosFunc)();
});
exports.syncCryptoMetadata = firebase_1.fn.onCall(async (_, { app }) => {
    authCheck(app);
    return await (0, cryptos_1.syncCryptoMetadataFunc)();
});
exports.syncCryptoAlgolia = firebase_1.fn.onCall(async (_, { app }) => {
    authCheck(app);
    return await (0, cryptos_1.syncCryptoAlgoliaFunc)();
});
const authCheck = (app) => {
    if (!app) {
        throw new firebase_1.HttpError('failed-precondition', 'The function must be called from an App Check verified app.');
    }
};
//# sourceMappingURL=index.js.map