import { Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common';
import { jwtConfig } from 'src/config/jwt-token.config';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  logger = new Logger(JwtStrategy.name);
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfig.secret,
    });
  }
  async validate(payload: JwtPayload): Promise<any> {
    this.logger.log(`validate payload: ${JSON.stringify(payload)}`);
    try {
      const { email } = payload;
      const user = await this.prismaService.user.findUnique({
        where: { email },
        include: {
          role: true,
          profile: true,
          wallet: {
            where: {
              deleted: false,
            },
          },
        },
      });
      if (!user) {
        this.logger.error(`user not found: ${email}`);
        throw new UnauthorizedException();
      }
      // user['tokenType'] = payload.tokenType;
      return { ...user };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
