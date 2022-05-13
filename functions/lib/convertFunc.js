"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertFunc = void 0;
const firebase_1 = require("./firebase");
const cmcApi_1 = require("./utils/cmcApi");
const dayjs = require("dayjs");
exports.convertFunc = firebase_1.fn.onCall(async (req, context) => {
    if (context.app == undefined) {
        throw new firebase_1.HttpError('failed-precondition', 'The function must be called from an App Check verified app.');
    }
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
});
//# sourceMappingURL=convertFunc.js.map