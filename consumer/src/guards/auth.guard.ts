import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt_service: JwtService,
    private config_service: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Invalid Token');
    }

    try {
      const payload = await this.jwt_service.verifyAsync(token, {
        secret: this.config_service.get<string>('jwt.secret'),
      });
      request['user'] = payload;
    } catch (err) {
      Logger.error(err);
      throw new UnauthorizedException('Token Expired');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request?.headers?.authorization?.split(' ')[1];
  }
}
