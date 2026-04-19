import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { DoctorModule } from './doctor/doctor.module';
import { AvailabilityModule } from './availability/availability.module';
import { AppointmentModule } from './appointment/appointment.module';
import { NotificationModule } from './notification/notification.module';
import { PaymentModule } from './payment/payment.module';
import { DoctorDashboardModule } from './doctor-dashboard/doctor-dashboard.module';
import { PatientDashboardModule } from './patient-dashboard/patient-dashboard.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DoctorModule,
    AvailabilityModule,
    AppointmentModule,
    NotificationModule,
    PaymentModule,
    DoctorDashboardModule,
    PatientDashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
