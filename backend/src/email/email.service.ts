import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class EmailService {
  transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('NODEMAILER_HOST'),
      port: this.configService.get('NODEMAILER_PORT'),
      secure: false,
      auth: {
        user: this.configService.get('NODEMAILER_AUTH_USER'),
        pass: this.configService.get('NODEMAILER_AUTH_PASS'),
      },
    });
  }

  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: this.configService.get('NODEMAILER_NAME'),
        address: this.configService.get('NODEMAILER_AUTH_USER'),
      },
      to,
      subject,
      html,
    });
  }
}
