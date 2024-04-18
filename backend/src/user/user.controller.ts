import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Inject,
  HttpStatus,
  DefaultValuePipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from 'src/email/email.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RequireLogin, UserInfo } from 'src/custom.decorator';
import { UserInfoVo } from './vo/user-info.vo';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { generateParseIntPipe } from 'src/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LoginUserVo } from './vo/login-user.vo';
import { RefreshTokenVo } from './vo/refresh-token.vo';
import { UserListVo } from './vo/user-list.vo';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAvatarDto } from './dto/upload-avatar.dto';
import { storage } from 'src/uploaded-file-storage';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @ApiBody({
    type: RegisterUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码错误/用户已存在/注册失败',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
    type: String,
  })
  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  async getCaptcha(
    prefix: string,
    email: string,
    captchaName: string,
    ttl?: number,
  ) {
    const code = Math.random().toString(36).slice(-6);

    await this.redisService.set(`${prefix}_${email}`, code, ttl ?? 60 * 5);

    await this.emailService.sendMail({
      to: email,
      subject: captchaName,
      html: `<h1>您的${captchaName}是${code}</h1>`,
    });

    return '验证码已发送';
  }

  @ApiQuery({
    name: 'email',
    description: '邮箱',
    required: true,
    type: String,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '验证码已发送',
    type: String,
  })
  @Get('register-captcha')
  async getRegisterCaptcha(@Query('email') email: string) {
    // const code = Math.random().toString(36).slice(-6);

    // await this.redisService.set(`captcha_${email}`, code, 60 * 5);

    // await this.emailService.sendMail({
    //   to: email,
    //   subject: '注册验证码',
    //   html: `<h1>您的注册验证码是${code}</h1>`,
    // });

    // return '验证码已发送';

    return await this.getCaptcha('register_captcha', email, '注册验证码');
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }

  @Post('login')
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  async userLogin(@Body() loginUser: LoginUserDto) {
    return await this.userService.loginAndReturnToken(loginUser, false);
  }

  @Post('admin/login')
  @ApiBody({
    type: LoginUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  async adminLogin(@Body() loginUser: LoginUserDto) {
    return await this.userService.loginAndReturnToken(loginUser, true);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxxxxxxxyyyyyyyyzzzzz',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'refreshToken无效',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('refresh-token')
  async userRefreshToken(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refreshToken(refreshToken, false);
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新 token',
    required: true,
    example: 'xxxxxxxxyyyyyyyyzzzzz',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'refreshToken无效',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: RefreshTokenVo,
  })
  @Get('admin/refresh-token')
  async adminRefreshToken(@Query('refreshToken') refreshToken: string) {
    return await this.userService.refreshToken(refreshToken, true);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息',
    type: UserInfoVo,
  })
  @ApiBearerAuth()
  @Get('info')
  @RequireLogin()
  async userInfo(@UserInfo('userId') userId: number) {
    const user = await this.userService.findUserDetailById(userId);
    const vo = new UserInfoVo();
    vo.id = user.id;
    vo.email = user.email;
    vo.username = user.username;
    vo.headPic = user.headPic;
    vo.phoneNumber = user.phoneNumber;
    vo.nickName = user.nickName;
    vo.createTime = user.createTime;
    vo.isAdmin = user.isAdmin;
    vo.isFrozen = user.isFrozen;
    return vo;
  }

  // 在没有登录的情况下也需要支持修改密码
  // @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserPasswordDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码错误/验证码已失效/修改密码失败',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改密码成功',
    type: String,
  })
  @Post(['update-password', 'admin/update-password'])
  // @RequireLogin()
  async updatePassword(
    // @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(passwordDto);
  }

  // @ApiBearerAuth()
  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱',
    required: true,
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '验证码已发送',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '接收验证码邮箱与用户绑定的邮箱信息不一致',
    type: String,
  })
  @Get('update-password-captcha')
  // @RequireLogin()
  async getUpdatePasswordCaptcha(
    @Query('email') email: string,
    // @UserInfo('email') userInfoEmail: string,
  ) {
    // if (email !== userInfoEmail)
    //   throw new HttpException(
    //     '接收验证码邮箱与用户绑定的邮箱信息不一致',
    //     HttpStatus.BAD_REQUEST,
    //   );

    // const code = Math.random().toString(36).slice(-6);

    // await this.redisService.set(
    //   `update_password_captcha_${email}`,
    //   code,
    //   60 * 5,
    // );

    // await this.emailService.sendMail({
    //   to: email,
    //   subject: '修改密码验证码',
    //   html: `<h1>您的修改密码验证码是${code}</h1>`,
    // });

    // return '验证码已发送';

    return await this.getCaptcha(
      'update_password_captcha',
      email,
      '修改密码验证码',
    );
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码错误/修改用户信息失败',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '修改用户信息成功',
    type: String,
  })
  @Post(['update-user', 'admin/update-user'])
  @RequireLogin()
  async updateUser(
    @UserInfo('userId') userId: number,
    @UserInfo('email') userInfoEmail: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUser(
      userId,
      updateUserDto,
      userInfoEmail,
    );
  }

  @ApiBearerAuth()
  @ApiBody({
    type: UploadAvatarDto,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '图片路径',
    type: String,
  })
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 3,
      },
      fileFilter(req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException('只能上传图片!'), false);
        }
        callback(null, true);
      },
    }),
  )
  @RequireLogin()
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file.path;
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: '验证码已发送',
    type: String,
  })
  @Get('update-user-captcha')
  @RequireLogin()
  async getUpdateUserCaptcha(@UserInfo('email') userInfoEmail: string) {
    return await this.getCaptcha(
      'update_user_captcha',
      userInfoEmail,
      '修改用户信息验证码',
    );
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'id',
    description: 'userId',
    type: Number,
  })
  @ApiResponse({
    type: String,
    description: 'success',
  })
  @RequireLogin()
  @Get('freeze-user')
  async freeze(@Query('id') userId: number) {
    await this.userService.freezeUserById(userId);
    return 'success';
  }

  @ApiBearerAuth()
  @ApiQuery({
    name: 'pageNo',
    description: '第几页',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'pageSize',
    description: '每页多少条',
    type: Number,
    required: false,
  })
  @ApiQuery({
    name: 'username',
    description: '用户名',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'nickName',
    description: '昵称',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'email',
    description: '邮箱地址',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: UserListVo,
    description: '用户列表',
  })
  @Get('list')
  async list(
    @Query('pageNo', new DefaultValuePipe(1), generateParseIntPipe('pageNo'))
    pageNo: number,
    @Query(
      'pageSize',
      new DefaultValuePipe(2),
      generateParseIntPipe('pageSize'),
    )
    pageSize: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUsersByPage(
      pageNo,
      pageSize,
      username,
      nickName,
      email,
    );
  }
}
