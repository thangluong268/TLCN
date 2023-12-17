"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const removeVietNameseTones_1 = require("./removeVietNameseTones");
function sortByConditions(entire, sortTypeQuery, sortValueQuery) {
    sortTypeQuery === 'asc' &&
        entire.sort((a, b) => {
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() > (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return -1;
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() < (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return 1;
            return 0;
        });
    sortTypeQuery === 'desc' &&
        entire.sort((a, b) => {
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() < (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return -1;
            if ((0, removeVietNameseTones_1.default)(a[`${sortValueQuery}`].toString()).toUpperCase() > (0, removeVietNameseTones_1.default)(b[`${sortValueQuery}`].toString()).toUpperCase())
                return 1;
            return 0;
        });
}
exports.default = sortByConditions;
//# sourceMappingURL=sortByContitions.js.map