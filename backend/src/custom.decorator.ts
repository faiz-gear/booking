import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { REQUIRE_LOGIN_TOKEN } from './login.guard';
import { REQUIRE_PERMISSION_TOKEN } from './permission.guard';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata(REQUIRE_LOGIN_TOKEN, true);

export const RequirePermission = (permissions: string[]) =>
  SetMetadata(REQUIRE_PERMISSION_TOKEN, permissions);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
