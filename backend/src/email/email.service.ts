import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Resend } from 'resend';

type EmailTarget = {
  userId?: string;
  patientId?: string;
  doctorId?: string;
};

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend;
  private readonly fromAddress: string;

  constructor(
    private prisma: PrismaService,
    private config: ConfigService,
  ) {
    const resendApiKey = this.config.get<string>('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new NotFoundException('RESEND_API_KEY is not configured');
    }

    this.fromAddress =
      this.config.get<string>('EMAIL_FROM') ?? 'onboarding@resend.dev';

    this.resend = new Resend(resendApiKey);
  }

  private async resolveRecipientEmails(target: EmailTarget) {
    const emailSet = new Set<string>();

    if (target.userId) {
      const user = await this.prisma.user.findUnique({
        where: { id: target.userId },
        select: { email: true },
      });

      if (user?.email) {
        emailSet.add(user.email);
      }
    }

    if (target.patientId) {
      const patient = await this.prisma.user.findUnique({
        where: { id: target.patientId },
        select: { email: true },
      });

      if (patient?.email) {
        emailSet.add(patient.email);
      }
    }

    if (target.doctorId) {
      const doctor = await this.prisma.doctor.findUnique({
        where: { id: target.doctorId },
        select: {
          user: {
            select: { email: true },
          },
        },
      });

      if (doctor?.user.email) {
        emailSet.add(doctor.user.email);
      }
    }

    const recipients = [...emailSet];

    if (recipients.length === 0) {
      throw new NotFoundException('Recipient email not found');
    }

    return recipients;
  }

  async sendEmail(
    target: EmailTarget,
    subject: string,
    text: string,
    html?: string,
  ) {
    const recipients = await this.resolveRecipientEmails(target);

    await Promise.all(
      recipients.map(async (to) => {
        const { error } = await this.resend.emails.send({
          from: this.fromAddress,
          to,
          subject,
          text,
          html: html ?? `<p>${text.replace(/\n/g, '<br/>')}</p>`,
        });

        if (error) {
          this.logger.error(
            `Resend failed for ${to}: ${error.message ?? 'unknown error'}`,
          );
          throw new InternalServerErrorException(
            `Failed to send email to ${to}`,
          );
        }

        this.logger.log(`Email sent to ${to} with subject "${subject}"`);
      }),
    );
  }

  async sendEmailToPatient(
    patientId: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    return this.sendEmail({ patientId }, subject, text, html);
  }

  async sendEmailToDoctor(
    doctorId: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    return this.sendEmail({ doctorId }, subject, text, html);
  }

  async sendEmailToUser(
    userId: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    return this.sendEmail({ userId }, subject, text, html);
  }

  async sendEmailToPatientAndDoctor(
    patientId: string,
    doctorId: string,
    subject: string,
    text: string,
    html?: string,
  ) {
    return this.sendEmail({ patientId, doctorId }, subject, text, html);
  }
}
