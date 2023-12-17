"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckRole = exports.CHECK_ROLE = void 0;
const common_1 = require("@nestjs/common");
exports.CHECK_ROLE = 'check_role';
const CheckRole = (...roles) => (0, common_1.SetMetadata)(exports.CHECK_ROLE, roles);
exports.CheckRole = CheckRole;
//# sourceMappingURL=role.decorator.js.map