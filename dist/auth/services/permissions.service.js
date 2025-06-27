"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionsService = exports.Permission = void 0;
const common_1 = require("@nestjs/common");
var Permission;
(function (Permission) {
    Permission["CREATE_USER"] = "create:user";
    Permission["READ_USER"] = "read:user";
    Permission["UPDATE_USER"] = "update:user";
    Permission["DELETE_USER"] = "delete:user";
})(Permission = exports.Permission || (exports.Permission = {}));
let PermissionsService = class PermissionsService {
    hasPermission(user, permission) {
        if (!user || !user.roles) {
            return false;
        }
        return user.roles.some(role => {
            if (role.nom === 'ADMIN') {
                return true;
            }
            return role.permissions && role.permissions.includes(permission);
        });
    }
    hasAllPermissions(user, permissions) {
        return permissions.every(permission => this.hasPermission(user, permission));
    }
    hasAnyPermission(user, permissions) {
        return permissions.some(permission => this.hasPermission(user, permission));
    }
};
PermissionsService = __decorate([
    (0, common_1.Injectable)()
], PermissionsService);
exports.PermissionsService = PermissionsService;
//# sourceMappingURL=permissions.service.js.map