import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class TokenGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException("Invalid Token");
    }

    request["token"] = token;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    return request?.headers?.authorization?.split(" ")[1];
  }
}
