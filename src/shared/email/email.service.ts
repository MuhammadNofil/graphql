import { Injectable } from '@nestjs/common';
import { SingleEmailDTO } from 'src/common/email.dto';
import { GroupInviteEmailDto } from 'src/common/group-invite-email.dto';
import { EmailClientService } from '../email-client/email-client.service';

@Injectable()
export class EmailService {
  constructor(private readonly emailClient: EmailClientService) {}

  async sendVerificationEmail(singleEmailDTO: SingleEmailDTO) {
    const { receiver, otp } = singleEmailDTO;
    const email = await this.emailClient.sendMail({
      sender: process.env.EMAIL,
      receiver,
      subject: 'Nuvomint verification code',
      html: `<p>You nuvomint verification code is ${otp} this code expires in 60 seconds</p>`,
    });
    return email;
  }

  async sendForgetPasswordEmail(singleEmailDTO: SingleEmailDTO) {
    const { receiver, otp } = singleEmailDTO;
    const email = await this.emailClient.sendMail({
      sender: process.env.EMAIL,
      receiver,
      subject: 'Nuvomint verification code',
      html: `<p>You nuvomint reset password code is ${otp} this code expires in 60 seconds</p>`,
    });
    return email;
  }

  async sendInvitationEmail(groupInviteEmailDto: GroupInviteEmailDto) {
    const { receiver, inviter, link, groupName } = groupInviteEmailDto;
    const email = await this.emailClient.sendMail({
      sender: process.env.EMAIL,
      receiver,
      subject: 'Nuvomint verification code',
      html: `<p>${inviter} Invited you to his group ${groupName} click on ${link} to join</p>`,
    });
    return email;
  }
}
