import { ApiProperty } from '@nestjs/swagger';
import { File } from 'buffer';

export class UploadAvatarDto {
  @ApiProperty({
    required: false,
  })
  file: File;
}
