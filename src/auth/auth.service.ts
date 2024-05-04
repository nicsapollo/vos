import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from "../users/users.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    // Find the user by username
    const user = await this.UsersService.findByUsername(username);

    // If user doesn't exist or password is incorrect, throw an unauthorized exception
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // If user and password are correct, return the user data without the password
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    // Generate a JWT token for the authenticated user
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
