"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.HttpError = exports.fn = exports.fs = void 0;
const admin = require("firebase-admin");
const functions = require("firebase-functions");
admin.initializeApp();
exports.fs = admin.firestore();
exports.fn = functions.runWith({
    timeoutSeconds: 500,
}).https;
exports.HttpError = functions.https.HttpsError;
exports.db = {
    pairsCol: exports.fs.collection(`pairs`),
    fiatsCol: exports.fs.collection(`fiats`),
    cryptosCol: exports.fs.collection(`cryptos`),
};
//# sourceMappingURL=firebase.js.map