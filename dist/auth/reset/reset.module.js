"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const reset_service_1 = require("./reset.service");
const reset_controller_1 = require("./reset.controller");
const Users_1 = require("../../entities/entities/Users");
const ResetToken_1 = require("../../entities/entities/ResetToken");
const email_service_1 = require("../../common/services/email.service");
let ResetModule = class ResetModule {
};
ResetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Users_1.Users, ResetToken_1.ResetToken]),
        ],
        controllers: [reset_controller_1.ResetController],
        providers: [reset_service_1.ResetService, email_service_1.EmailService],
        exports: [reset_service_1.ResetService],
    })
], ResetModule);
exports.ResetModule = ResetModule;
//# sourceMappingURL=reset.module.js.map