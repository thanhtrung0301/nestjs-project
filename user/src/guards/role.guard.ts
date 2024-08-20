import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES } from 'src/decoratos/roles.decoratos';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly refector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> {
    const roles: string[] = this.refector.getAllAndOverride(ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);
    // const request: Request = context.switchToHttp().getRequest();
    const ctx = context.switchToRpc().getContext();
    const data = context.switchToRpc().getData();

    // Logger.log(request['user'])
    // Logger.log("roleauth", data)
    return roles.includes(data['user'].role as unknown as string);
  }
}
