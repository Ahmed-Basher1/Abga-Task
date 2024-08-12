import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, body: string) {
    try {
      await this.mailerService.sendMail({
        to: to, // list of receivers
        from: 'ahmed@test.com', // sender address
        subject: subject, // Subject line
        text: body, // plain text body
        html: `<b>${body}</b>`, // HTML body content
      });
      console.log('Mail successfully sent to', to);
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  async sendOtpForForgetPassword(email: string) {
    let otp = Math.floor(100000 + Math.random() * 900000);
    await this.sendEmail(email, 'Forget Password', `Your OTP is ${otp}`);
    return otp;
  }

  async SendTaskCompletionEmail(email: string, task: string) {
    await this.sendEmail(email, 'Task Completed', `Your task ${task} is completed`);
  }

  async SendTaskCreationEmail(email: string, task: string) {
    await this.sendEmail(email, 'Task Created', `Your task ${task} is created`);
  }
}
