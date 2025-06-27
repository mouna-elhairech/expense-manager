import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

// ✅ Contrôleurs et services racine
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ✅ Modules métiers
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ExpensesModule } from './expenses/expenses.module';
import { ReportsModule } from './reports/reports.module';
import { SettingsModule } from './settings/settings.module';
import { CategoriesModule } from './categories/categories.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommentairesModule } from './commentaires/commentaires.module';
import { ReimbursementsModule } from './reimbursements/reimbursements.module';

// ✅ Entités
import { Users } from './entities/entities/Users';
import { Roles } from './entities/entities/Roles';
import { UserRoles } from './entities/entities/UserRoles';
import { Depenses } from './entities/entities/Depenses';
import { Recus } from './entities/entities/Recus';
import { OcrProcessing } from './entities/entities/OcrProcessing';
import { Category } from './categories/entities/category.entity';
// ❌ SUPPRIMÉ : import { NlpCategorization } from './categories/entities/nlp-categorization.entity';
import { NlpCategorization } from './entities/entities/NlpCategorization'; // ✅ Le bon chemin
import { ReimbursementRequest } from './entities/entities/ReimbursementRequest';
import { Commentaires } from './entities/entities/Commentaires';
import { Notifications } from './entities/entities/notifications';
import { Rapports } from './entities/entities/Rapports';
import { ResetToken } from './entities/entities/ResetToken';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: config.get('GMAIL_USER'),
            pass: config.get('GMAIL_PASS'),
          },
        },
        defaults: {
          from: `"Expense Manager" <${config.get('GMAIL_USER')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: +configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'manani'),
        database: configService.get('DB_DATABASE', 'expense_manager'),
        entities: [
          Users,
          Roles,
          UserRoles,
          Depenses,
          Recus,
          OcrProcessing,
          Category,
          NlpCategorization,
          ReimbursementRequest,
          Commentaires,
          Notifications,
          Rapports,
          ResetToken,
        ],
        synchronize: false,
        logging: ['query', 'error'],
        logger: 'advanced-console',
      }),
    }),

    AuthModule,
    UsersModule,
    RolesModule,
    ExpensesModule,
    ReportsModule,
    SettingsModule,
    CategoriesModule,
    NotificationsModule,
    CommentairesModule,
    ReimbursementsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
