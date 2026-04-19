import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppointmentPaidEvent } from '../events/appointment.events';

@Injectable()
export class PaymentService {
  private stripe: InstanceType<typeof Stripe>;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      {
        apiVersion: '2026-03-25.dahlia',
      },
    );
  }

  async createCheckoutSession(appointmentId: string) {
    const frontendBaseUrl =
      this.configService.get<string>('FRONTEND_URL')?.replace(/\/$/, '') ||
      'http://localhost:5173';

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { doctor: true },
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Doctor Consultation',
            },
            unit_amount: Math.round(appointment.doctor.fees * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${frontendBaseUrl}/success`,
      cancel_url: `${frontendBaseUrl}/cancel`,
    });

    await this.prisma.payment.create({
      data: {
        appointmentId,
        amount: appointment.doctor.fees,
        status: PaymentStatus.PENDING, // later switch to enum
        stripeSessionId: session.id,
      },
    });

    return { url: session.url };
  }

  async handleWebhook(req: any, res: any) {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        sig,
        this.configService.get('STRIPE_WEBHOOK_SECRET')!,
      );
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // 🎯 HANDLE EVENTS
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;

      // find payment using session id
      const payment = await this.prisma.payment.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (payment) {
        // update payment
        await this.prisma.payment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.PAID },
        });

        // update appointment and notify listeners after payment confirmation
        const updatedAppointment = await this.prisma.appointment.update({
          where: { id: payment.appointmentId },
          data: { status: AppointmentStatus.ACCEPTED },
        });

        this.eventEmitter.emit(
          'appointment.paid',
          new AppointmentPaidEvent(
            updatedAppointment.id,
            updatedAppointment.patientId,
            updatedAppointment.doctorId,
            updatedAppointment.meetingLink,
          ),
        );
      }
    }

    res.json({ received: true });
  }
}
