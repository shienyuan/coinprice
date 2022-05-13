"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCryptoAlgolia = exports.syncCryptoMetadata = exports.syncCryptos = exports.convert = exports.getCryptos = exports.getFiats = void 0;
const dayjs = require("dayjs");
const firebase_1 = require("./firebase");
const cmcapi_1 = require("./cmcapi");
const algoliasearch_1 = require("algoliasearch");
const algoliaClient = (0, algoliasearch_1.default)(process.env.AG_APP_ID, process.env.AG_API_KEY);
const algoliaIndex = algoliaClient.initIndex('cryptos');
const fetchDataInterval = 30; // day
exports.getFiats = firebase_1.fn.onCall(async (_, context) => {
    var _a;
    if (context.app == undefined) {
        throw new firebase_1.HttpError('failed-precondition', 'The function must be called from an App Check verified app.');
    }
    const now = dayjs();
    const stats = await firebase_1.db.statsCol.doc('fiats').get();
    const expired = dayjs((_a = stats.data()) === null || _a === void 0 ? void 0 : _a.last_updated_at.toDate()).isAfter(now.add(fetchDataInterval, 'd'));
    if (!stats.exists || expired) {
        return await updateFiats(now.toDate());
    }
    const snaps = await firebase_1.db.fiatsCol.limit(10).orderBy('rank').get();
    return snaps.docs.map((doc) => doc.data());
});
exports.getCryptos = firebase_1.fn.onCall(async (_, context) => {
    if (context.app == undefined) {
        throw new firebase_1.HttpError('failed-precondition', 'The function must be called from an App Check verified app.');
    }
    const snaps = await firebase_1.db.cryptosCol.limit(10).orderBy('rank').get();
    return snaps.docs.map((doc) => doc.data());
});
exports.convert = firebase_1.fn.onCall(async (req, context) => {
    if (context.app == undefined) {
        throw new firebase_1.HttpError('failed-precondition', 'The function must be called from an App Check verified app.');
    }
    if (!req.from.currency || !req.to.currency)
        return {
            amount: 0,
            lastUpdated: dayjs().toDate(),
        };
    const converted = await cmcapi_1.cmcRequest.get('/v2/tools/price-conversion', {
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
const updateFiats = async (now) => {
    const { data } = await cmcapi_1.cmcRequest.get('/v1/fiat/map');
    const batch = firebase_1.fs.batch();
    data.data.forEach((fiat) => batch.set(firebase_1.db.fiatsCol.doc(fiat.id.toString()), fiat));
    await batch.commit();
    await firebase_1.db.statsCol
        .doc('fiats')
        .set({ last_updated_at: now, total: data.data.length });
    return data.data;
};
exports.syncCryptos = firebase_1.fn.onCall(async () => {
    let page = 1;
    const fetch = async () => {
        const { data } = await cmcapi_1.cmcRequest.get('/v1/cryptocurrency/map', {
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
});
exports.syncCryptoMetadata = firebase_1.fn.onCall(async () => {
    var _a;
    const cryptos = await firebase_1.db.cryptosCol.get();
    const ids = cryptos.docs.map((val) => val.data().id);
    console.log('syncing ', ids.length);
    for (let i = 0; i < ids.length; i += 100) {
        const { data } = await cmcapi_1.cmcRequest.get('/v2/cryptocurrency/info', {
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
});
exports.syncCryptoAlgolia = firebase_1.fn.onCall(async () => {
    const cryptos = await firebase_1.db.cryptosCol.get();
    algoliaIndex.saveObjects(cryptos.docs.map((val) => {
        return Object.assign({ objectID: val.id }, val.data());
    }), { autoGenerateObjectIDIfNotExist: true });
    return 'Success';
});
//# sourceMappingURL=index.js.map