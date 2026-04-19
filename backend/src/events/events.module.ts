import { Module } from '@nestjs/common';
import { AppointmentEmailListener } from './listeners/appointment-email.listener';
import { DoctorEmailListener } from './listeners/doctor-email.listener';
import { EmailModule } from '../email/email.module';
import { PaymentModule } from '../payment/payment.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [EmailModule, PaymentModule, PrismaModule],
  providers: [AppointmentEmailListener, DoctorEmailListener],
})
export class EventsModule {}
