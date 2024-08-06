import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject(UserService)
  private readonly userService: UserService;

  async validate(username: string, password: string) {
    const dto = new LoginUserDto();
    dto.username = username;
    dto.password = password;
    const user = await this.userService.login(dto, false);

    return user;
  }
}
