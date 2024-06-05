import { Injectable } from '@nestjs/common';
//import { ClientResponse, MailDataRequired, send, setApiKey } from '@sendgrid/mail';
import * as sg from '@sendgrid/mail';
import { SingleEmailClientDTO } from 'src/common/emailClient.dto';
@Injectable()
export class EmailClientService {
  constructor() {
    sg.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendMail(singleEmailDTO: SingleEmailClientDTO): Promise<[sg.ClientResponse, {}]> {
    console.log(singleEmailDTO);
    const msg: sg.MailDataRequired = {
      to: singleEmailDTO.receiver,
      from: singleEmailDTO.sender,
      subject: singleEmailDTO.subject,
      html: singleEmailDTO.html,
    };
    const email = await sg.send(msg);
    return email;
  }
}
