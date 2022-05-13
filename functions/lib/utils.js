"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectionExists = void 0;
const collectionExists = (collection) => {
    let exists = false;
    collection
        .get()
        .then((snap) => {
        console.log((exists = snap.size > 0));
        exists = snap.size > 0;
    })
        .catch((e) => {
        console.error('ddd' + e);
    });
    return exists;
};
exports.collectionExists = collectionExists;
//# sourceMappingURL=utils.js.map