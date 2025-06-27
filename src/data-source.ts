import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

import { Users } from './entities/entities/Users';
import { Roles } from './entities/entities/Roles';
import { UserRoles } from './entities/entities/UserRoles';
import { Depenses } from './entities/entities/Depenses';
import { Recus } from './entities/entities/Recus';
import { OcrProcessing } from './entities/entities/OcrProcessing';
import { NlpCategorization } from './entities/entities/NlpCategorization';
import { ReimbursementRequest } from './entities/entities/ReimbursementRequest';
import { Commentaires } from './entities/entities/Commentaires';
import { Notifications } from './entities/entities/notifications';
import { Rapports } from './entities/entities/Rapports';
import { Settings } from './entities/entities/Settings';
import { ResetToken } from './entities/entities/ResetToken';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'manani',
  database: process.env.DATABASE_NAME || 'expense_manager',
  entities: [
    Users,
    Roles,
    UserRoles,
    Depenses,
    Recus,
    OcrProcessing,
    NlpCategorization,
    ReimbursementRequest,
    Commentaires,
    Notifications,
    Rapports,
    Settings,
    ResetToken,
  ],
  // Aucune migration utilisée
  synchronize: false,
  logging: ['error', 'query'],
});
