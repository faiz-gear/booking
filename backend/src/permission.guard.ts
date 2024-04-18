import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

export const REQUIRE_PERMISSION_TOKEN = 'require-permission';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // 登录都不需要, 也就不需要权限
    if (!request.user) return true;

    const permissions = request.user.permissions;

    const requirePermission = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_PERMISSION_TOKEN,
      [context.getClass(), context.getHandler()],
    );

    if (!requirePermission) return true;

    const hasPermission = requirePermission.every((item) =>
      permissions.some((permission) => permission.code === item),
    );

    if (!hasPermission) throw new UnauthorizedException('您没有权限访问该接口');

    return true;
  }
}
