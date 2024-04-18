import { EmailService } from './email.service';
import { Controller } from '@nestjs/common';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
}
