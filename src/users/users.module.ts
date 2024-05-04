import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
import { User } from './user.entity';
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
            JwtModule.register({
                secret: 'secret',
                signOptions: {expiresIn: '1d'}
            }),
            
    ],
    controllers: [UsersController],
    providers: [UsersService]
})
export class UsersModule {}