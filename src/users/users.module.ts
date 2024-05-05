import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from './user.entity';
import { Transaction } from '../transactions/transaction.entity'; // Import Transaction entity
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Transaction]), // Include Transaction entity
        JwtModule.register({
            secret: 'secret',
            signOptions: { expiresIn: '1d' }
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule { }
