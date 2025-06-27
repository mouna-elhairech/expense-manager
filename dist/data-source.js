"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const Users_1 = require("./entities/entities/Users");
const Roles_1 = require("./entities/entities/Roles");
const UserRoles_1 = require("./entities/entities/UserRoles");
const Depenses_1 = require("./entities/entities/Depenses");
const Recus_1 = require("./entities/entities/Recus");
const OcrProcessing_1 = require("./entities/entities/OcrProcessing");
const NlpCategorization_1 = require("./entities/entities/NlpCategorization");
const ReimbursementRequest_1 = require("./entities/entities/ReimbursementRequest");
const Commentaires_1 = require("./entities/entities/Commentaires");
const notifications_1 = require("./entities/entities/notifications");
const Rapports_1 = require("./entities/entities/Rapports");
const Settings_1 = require("./entities/entities/Settings");
const ResetToken_1 = require("./entities/entities/ResetToken");
exports.default = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'manani',
    database: process.env.DATABASE_NAME || 'expense_manager',
    entities: [
        Users_1.Users,
        Roles_1.Roles,
        UserRoles_1.UserRoles,
        Depenses_1.Depenses,
        Recus_1.Recus,
        OcrProcessing_1.OcrProcessing,
        NlpCategorization_1.NlpCategorization,
        ReimbursementRequest_1.ReimbursementRequest,
        Commentaires_1.Commentaires,
        notifications_1.Notifications,
        Rapports_1.Rapports,
        Settings_1.Settings,
        ResetToken_1.ResetToken,
    ],
    synchronize: false,
    logging: ['error', 'query'],
});
//# sourceMappingURL=data-source.js.map