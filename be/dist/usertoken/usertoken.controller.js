"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsertokenController = void 0;
const common_1 = require("@nestjs/common");
const usertoken_service_1 = require("./usertoken.service");
let UsertokenController = class UsertokenController {
    constructor(usertokenService) {
        this.usertokenService = usertokenService;
    }
};
exports.UsertokenController = UsertokenController;
exports.UsertokenController = UsertokenController = __decorate([
    (0, common_1.Controller)('usertoken'),
    __metadata("design:paramtypes", [usertoken_service_1.UsertokenService])
], UsertokenController);
//# sourceMappingURL=usertoken.controller.js.map