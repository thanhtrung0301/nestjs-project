import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwt_service: JwtService,
    private config_service: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request: Request = context.switchToHttp().getRequest();
    // const token = this.extractTokenFromHeader(request);
    const ctx = context.switchToRpc().getContext();
    const data = context.switchToRpc().getData();

    const token = data.token;

    if (!token) {
      throw new RpcException(new UnauthorizedException('Forbidden'));
    }
    Logger.log(token);

    try {
      const payload = await this.jwt_service.verifyAsync(token, {
        secret: this.config_service.get<string>('jwt.secret'),
      });

    Logger.log(payload);


      data['user'] = payload;
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
