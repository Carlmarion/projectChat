import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserPayload } from './jwt.strategy';
import { CreateUserDto } from './dto/create-user.dto';
import { LogUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ authBody }: { authBody: LogUserDto }) {
    try {
      const { email, password } = authBody;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!existingUser) {
        throw new Error("User doesn't exist");
      }
      const isPasswordValid = await this.isPasswordValid({
        password,
        hashedPassword: existingUser.password,
      });

      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }
      // For user creation.

      return this.authenticateUser({ userId: existingUser.id });
    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  async register({ registerBody }: { registerBody: CreateUserDto }) {
    try {
      const { email, firstName, password } = registerBody;

      const existingUser = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) {
        throw new Error('An account already exists for this email address');
      }
      const hashedPassword = await this.hashPassword({ password });
      // We create the user
      const createdUser = await this.prisma.user.create({
        data: {
          email,
          firstName,
          password: hashedPassword,
        },
      });
      // For user creation.
      //const hashPassword = await this.hashPassword({ password });
      return this.authenticateUser({ userId: createdUser.id });
    } catch (e) {
      return {
        error: true,
        message: e.message,
      };
    }
  }

  private async hashPassword({ password }: { password: string }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async isPasswordValid({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    const isPasswordValid = await compare(password, hashedPassword);
    return isPasswordValid;
  }

  private authenticateUser({ userId }: UserPayload) {
    const payload: UserPayload = { userId };
    return { access_token: this.jwtService.sign(payload) };
  }
}
