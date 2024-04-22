import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';
import { join } from 'path';

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

export const pathJoin = (path: string) => join(__dirname, path);

export const isProduction = process.env.NEST_ENV === 'production';

export const envPaths = [pathJoin('.env.local'), pathJoin('.env')];
if (isProduction) {
  // 生产环境下，只加载 .env 文件
  envPaths.shift();
}
