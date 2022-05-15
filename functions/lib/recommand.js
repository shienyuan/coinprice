"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPopularPairsFunc = void 0;
const firebase_1 = require("./utils/firebase");
const getPopularPairsFunc = async () => (await firebase_1.db.pairsCol.orderBy('hits').limit(10).get()).docs;
exports.getPopularPairsFunc = getPopularPairsFunc;
//# sourceMappingURL=recommand.js.map