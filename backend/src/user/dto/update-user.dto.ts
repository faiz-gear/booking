import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  headPic: string;

  @ApiProperty({
    required: false,
  })
  nickName: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '验证码不能为空',
  })
  captcha: string;
}
