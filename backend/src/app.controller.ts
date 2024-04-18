import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, RequirePermission, UserInfo } from './custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  // @SetMetadata(REQUIRE_LOGIN_TOKEN, true)
  // @SetMetadata(REQUIRE_PERMISSION_TOKEN, ['ddd'])
  @RequireLogin()
  @RequirePermission(['ddd'])
  aaa(@UserInfo('username') username: string, @UserInfo() userInfo) {
    console.log(
      '🚀 ~ file: app.controller.ts ~ line 20 ~ AppController ~ aaa ~ userInfo',
      userInfo,
    );
    console.log(
      '🚀 ~ file: app.controller.ts ~ line 20 ~ AppController ~ aaa ~ username',
      username,
    );
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
