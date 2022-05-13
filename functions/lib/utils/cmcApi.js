"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmcRequest = void 0;
const axios_1 = require("axios");
exports.cmcRequest = axios_1.default.create({
    timeout: Number(process.env.TIMEOUT),
    baseURL: String(process.env.CMC_BASE_URL),
    headers: { 'X-CMC_PRO_API_KEY': String(process.env.CMC_API_KEY) },
});
exports.cmcRequest.interceptors.request.use(function (config) {
    console.log(config.url);
    return config;
}, function (error) {
    console.error(error);
    return Promise.reject(error);
});
exports.default = exports.cmcRequest;
//# sourceMappingURL=cmcApi.js.map