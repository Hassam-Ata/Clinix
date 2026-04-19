import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../../email/email.service';
import { PaymentService } from '../../payment/payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AppointmentAcceptedEvent,
  AppointmentPaidEvent,
  AppointmentRejectedEvent,
} from '../appointment.events';

@Injectable()
export class AppointmentEmailListener {
  constructor(
    private emailService: EmailService,
    private config: ConfigService,
    private paymentService: PaymentService,
    private prisma: PrismaService,
  ) {}

  @OnEvent('appointment.accepted')
  async handleAccepted(event: AppointmentAcceptedEvent) {
    const checkout = await this.paymentService.createCheckoutSession(
      event.appointmentId,
    );

    await this.emailService.sendEmail(
      { patientId: event.patientId },
      'Appointment Accepted',
      `Your appointment has been accepted.

Please complete the payment here:
${checkout.url}

After payment is confirmed, we will send the meeting link by email.
      `,
    );
  }

  @OnEvent('appointment.rejected')
  async handleRejected(event: AppointmentRejectedEvent) {
    await this.emailService.sendEmail(
      { patientId: event.patientId },
      'Appointment Rejected',
      'Your appointment was rejected by the doctor.',
    );
  }

  @OnEvent('appointment.paid')
  async handlePaid(event: AppointmentPaidEvent) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: event.appointmentId },
      select: { meetingLink: true },
    });

    const frontendUrl =
      this.config.get<string>('FRONTEND_URL') ?? 'http://localhost:3000';
    const meetingLink =
      appointment?.meetingLink ??
      `${frontendUrl}/patient/appointments/${event.appointmentId}`;

    await this.emailService.sendEmail(
      { patientId: event.patientId },
      'Payment Confirmed',
      `Your payment has been confirmed.

Meeting Link: ${meetingLink}

Please join the consultation at the scheduled time.`,
    );
  }
}
