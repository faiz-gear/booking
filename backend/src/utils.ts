import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

export function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    // 优化Pipe校验异常响应信息
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}
