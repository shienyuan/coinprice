"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmcRequest = void 0;
const axios_1 = require("axios");
const timeout = 5000;
const cmcRequest = axios_1.default.create({
    timeout,
    baseURL: process.env.CMC_BASE_URL,
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY },
});
exports.cmcRequest = cmcRequest;
cmcRequest.interceptors.request.use(function (config) {
    console.log(config.url);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});
//# sourceMappingURL=cmcapi.js.map