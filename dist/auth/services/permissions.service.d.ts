export declare enum Permission {
    CREATE_USER = "create:user",
    READ_USER = "read:user",
    UPDATE_USER = "update:user",
    DELETE_USER = "delete:user"
}
export declare class PermissionsService {
    hasPermission(user: any, permission: Permission): boolean;
    hasAllPermissions(user: any, permissions: Permission[]): boolean;
    hasAnyPermission(user: any, permissions: Permission[]): boolean;
}
