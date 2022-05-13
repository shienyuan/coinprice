"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs = require("dayjs");
const cmcApi_1 = require("./utils/cmcApi");
exports.default = async (req) => {
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
//# sourceMappingURL=convert.js.map