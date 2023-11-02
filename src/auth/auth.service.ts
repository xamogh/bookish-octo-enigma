import { PrismaService } from 'nestjs-prisma';
import { User, UserStatus } from '@prisma/client';
import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from './password.service';
import { Token } from './models/token.model';
import { SecurityConfig } from '../common/configs/config.interface';
import moment from 'moment';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  // seconds
  private PASSWORD_TOKEN_EXPIRE_DURATION = 180;

  async login(username: string, password: string): Promise<Token> {
    const user = await this.prisma.user.findUnique({
      where: { username, isDeleted: false, status: UserStatus.VALIDATED },
    });

    const passwordValid =
      user &&
      (await this.passwordService.validatePassword(password, user.password));

    if (!passwordValid) {
      throw new BadRequestException('Invalid username or password');
    }

    return this.generateTokens({
      userId: user.id,
    });
  }

  async initiateResetPassword(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      include: {
        member: true,
      },
    });

    if (!user || !user.isDeleted || !user.member.email) return;

    await this.prisma.passwordToken.delete({
      where: {
        userId: user.id,
      },
    });

    const token = this.passwordService.createPasswordResetToken();
    const hashedToken = await this.passwordService.hashToken(token);

    await this.prisma.passwordToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expireAt: moment()
          .add(this.PASSWORD_TOKEN_EXPIRE_DURATION, 'seconds')
          .toISOString(),
      },
    });

    this.emailService.sendMail({
      to: user.member.email,
      subject: 'BKBDS Password Reset',
      text: this.getPasswordResetEmailText(token, user.id),
    });
  }

  getPasswordResetEmailText(token: string, userId: number) {
    return `Please click the link to reset your password: ${this.configService.get(
      'PUBLIC_URI',
    )}/password-reset/verify?token=${token}&userId=${userId}`;
  }

  validateUser(userId: number): Promise<User> {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  getUserFromToken(token: string): Promise<User> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.user.findUnique({ where: { id } });
  }

  generateTokens(payload: { userId: number }): Token {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  private generateAccessToken(payload: { userId: number }): string {
    return this.jwtService.sign(payload);
  }

  private generateRefreshToken(payload: { userId: number }): string {
    const securityConfig = this.configService.get<SecurityConfig>('security');
    return this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: securityConfig.refreshIn,
    });
  }

  refreshToken(token: string) {
    try {
      const { userId } = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      return this.generateTokens({
        userId,
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
