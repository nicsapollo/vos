import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { join } from 'path';
import { MenusModule } from './menu/menus.module';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionItemsModule } from './transaction-items/transaction-items.module';
import { JwtModule } from '@nestjs/jwt';
import { RequestsModule } from './request/requests.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [join(process.cwd(), 'dist/**/*.entity.js')],
        synchronize: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    MenusModule,
    TransactionsModule,
    TransactionItemsModule,
    RequestsModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1d'}
    }),
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
