import { Injectable } from '@nestjs/common';
import { EmailService } from '../../email/email.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DoctorEmailListener {
  constructor(
    private emailService: EmailService,
    private config: ConfigService,
  ) {}

  @OnEvent('doctor.approved')
  async handleApproved(event: any) {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');

    await this.emailService.sendEmail(
      { userId: event.userId },
      'Doctor Application Approved',
      `
Congratulations!

Your doctor application has been approved.

👉 Access your dashboard here:
${frontendUrl}/doctor/dashboard

You can now start accepting patients.
      `,
    );
  }

  @OnEvent('doctor.rejected')
  async handleRejected(event: any) {
    await this.emailService.sendEmail(
      { userId: event.userId },
      'Doctor Application Rejected',
      `
Unfortunately your application was rejected.

Reason: ${event.reason}

Please update your documents and reapply.
      `,
    );
  }
}
