"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cryptosIndex = void 0;
const algoliasearch_1 = require("algoliasearch");
const algoliaClient = (0, algoliasearch_1.default)(process.env.AG_APP_ID, process.env.AG_API_KEY);
exports.cryptosIndex = algoliaClient.initIndex('cryptos');
//# sourceMappingURL=algolia.js.map