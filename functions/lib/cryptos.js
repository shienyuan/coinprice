"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCryptoAlgoliaFunc = exports.syncCryptoMetadataFunc = exports.syncCryptosFunc = exports.getCryptosFunc = void 0;
const firebase_1 = require("./utils/firebase");
const cmcApi_1 = require("./utils/cmcApi");
const algolia_1 = require("./utils/algolia");
const getCryptosFunc = async () => {
    const snaps = await firebase_1.db.cryptosCol.limit(10).orderBy('rank').get();
    return snaps.docs.map((doc) => doc.data());
};
exports.getCryptosFunc = getCryptosFunc;
const syncCryptosFunc = async () => {
    let page = 1;
    const fetch = async () => {
        const { data } = await cmcApi_1.cmcRequest.get('/v1/cryptocurrency/map', {
            params: {
                start: page,
                limit: 500,
                sort: 'cmc_rank',
            },
        });
        const batch = firebase_1.fs.batch();
        for (const crypto of data.data) {
            batch.set(firebase_1.db.cryptosCol.doc(crypto.id.toString()), crypto);
        }
        await batch.commit();
        // only 500 for alpha stage
        if (data.data.length >= 500 && page < 0) {
            page += 500;
            await fetch();
        }
    };
    await fetch();
    return 'Success';
};
exports.syncCryptosFunc = syncCryptosFunc;
const syncCryptoMetadataFunc = async () => {
    var _a;
    const cryptos = await firebase_1.db.cryptosCol.get();
    const ids = cryptos.docs.map((val) => val.data().id);
    console.log('syncing ', ids.length);
    for (let i = 0; i < ids.length; i += 100) {
        const { data } = await cmcApi_1.cmcRequest.get('/v2/cryptocurrency/info', {
            params: {
                id: ids.slice(i, i + 100).toString(),
                aux: 'logo',
            },
        });
        const batch = firebase_1.fs.batch();
        for (const id of ids.slice(i, i + 100)) {
            batch.update(firebase_1.db.cryptosCol.doc(id.toString()), {
                icon: ((_a = data.data[id]) === null || _a === void 0 ? void 0 : _a.logo) ? data.data[id].logo : '',
            });
        }
        await batch.commit();
    }
    return 'Success';
};
exports.syncCryptoMetadataFunc = syncCryptoMetadataFunc;
const syncCryptoAlgoliaFunc = async () => {
    const cryptos = await firebase_1.db.cryptosCol.get();
    algolia_1.cryptosIndex.saveObjects(cryptos.docs.map((val) => {
        return Object.assign({ objectID: val.id }, val.data());
    }), { autoGenerateObjectIDIfNotExist: true });
    return 'Success';
};
exports.syncCryptoAlgoliaFunc = syncCryptoAlgoliaFunc;
//# sourceMappingURL=cryptos.js.map