"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GiveGateway = exports.MoMoGateway = exports.VNPayGateway = exports.PAYMENT_METHOD = void 0;
var PAYMENT_METHOD;
(function (PAYMENT_METHOD) {
    PAYMENT_METHOD["VNPAY"] = "vnpay";
    PAYMENT_METHOD["MOMO"] = "momo";
    PAYMENT_METHOD["GIVE"] = "give";
})(PAYMENT_METHOD || (exports.PAYMENT_METHOD = PAYMENT_METHOD = {}));
class VNPayGateway {
    processPayment(bill) {
        return 1;
    }
}
exports.VNPayGateway = VNPayGateway;
class MoMoGateway {
    processPayment(bill) {
        return 2;
    }
}
exports.MoMoGateway = MoMoGateway;
class GiveGateway {
    processPayment(bill) {
        return 0;
    }
}
exports.GiveGateway = GiveGateway;
//# sourceMappingURL=payment.gateway.js.map