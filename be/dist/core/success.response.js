"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Created = exports.OK = exports.SuccessResponse = exports.ReasonPhrase = exports.StatusCode = void 0;
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["CREATED"] = 201] = "CREATED";
    StatusCode[StatusCode["ACCEPTED"] = 202] = "ACCEPTED";
    StatusCode[StatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    StatusCode[StatusCode["PARTIAL_CONTENT"] = 206] = "PARTIAL_CONTENT";
    StatusCode[StatusCode["MULTI_STATUS"] = 207] = "MULTI_STATUS";
    StatusCode[StatusCode["ALREADY_REPORTED"] = 208] = "ALREADY_REPORTED";
    StatusCode[StatusCode["IM_USED"] = 226] = "IM_USED";
})(StatusCode || (exports.StatusCode = StatusCode = {}));
var ReasonPhrase;
(function (ReasonPhrase) {
    ReasonPhrase["OK"] = "OK";
    ReasonPhrase["CREATED"] = "Created";
    ReasonPhrase["ACCEPTED"] = "Accepted";
    ReasonPhrase["NO_CONTENT"] = "No Content";
    ReasonPhrase["PARTIAL_CONTENT"] = "Partial Content";
    ReasonPhrase["MULTI_STATUS"] = "Multi-Status";
    ReasonPhrase["ALREADY_REPORTED"] = "Already Reported";
    ReasonPhrase["IM_USED"] = "IM Used";
})(ReasonPhrase || (exports.ReasonPhrase = ReasonPhrase = {}));
class SuccessResponse {
    constructor({ message, statusCode = StatusCode.OK, reasonPhrase = ReasonPhrase.OK, metadata = {}, }) {
        this.message = !message ? reasonPhrase : message;
        this.status = statusCode;
        this.metadata = metadata;
    }
}
exports.SuccessResponse = SuccessResponse;
class OK extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}
exports.OK = OK;
class Created extends SuccessResponse {
    constructor({ options = {}, message, statusCode = StatusCode.CREATED, reasonPhrase = ReasonPhrase.CREATED, metadata, }) {
        super({ message, statusCode, reasonPhrase, metadata });
        this.options = options;
    }
}
exports.Created = Created;
//# sourceMappingURL=success.response.js.map