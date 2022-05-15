"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addConvertPair = exports.convertFunc = void 0;
const dayjs = require("dayjs");
const cmcApi_1 = require("./utils/cmcApi");
const firebase_1 = require("./utils/firebase");
const firestore_1 = require("firebase-admin/firestore");
const convertFunc = async (req) => {
    if (!req.from.currency || !req.to.currency)
        return {
            amount: 0,
            lastUpdated: dayjs().toDate(),
        };
    const converted = await cmcApi_1.default.get('/v2/tools/price-conversion', {
        params: {
            amount: req.from.amount,
            id: req.from.currency.id,
            convert_id: req.to.currency.id,
        },
    });
    const data = converted.data.data.quote[req.to.currency.id];
    return {
        amount: data.price,
        lastUpdated: data.last_updated,
    };
};
exports.convertFunc = convertFunc;
const addConvertPair = async (from, to) => {
    const doc = await firebase_1.db.pairsCol.doc(`${from.symbol}${to.symbol}`).get();
    if (doc.exists) {
        await firebase_1.db.pairsCol.doc(`${from.symbol}${to.symbol}`).update({
            hits: firestore_1.FieldValue.increment(1),
        });
    }
    else {
        await firebase_1.db.pairsCol.doc(`${from.symbol}${to.symbol}`).set({
            from,
            to,
            hits: 1,
        });
    }
};
exports.addConvertPair = addConvertPair;
//# sourceMappingURL=convert.js.map