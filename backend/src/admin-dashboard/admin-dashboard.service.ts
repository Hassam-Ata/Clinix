import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AppointmentStatus,
  PaymentStatus,
  DoctorStatus,
  Role,
} from '@prisma/client';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  // 📊 OVERVIEW
  async getOverview() {
    const [users, doctors, patients, appointments] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.doctor.count(),
      this.prisma.user.count({ where: { role: Role.PATIENT } }),
      this.prisma.appointment.count(),
    ]);

    return {
      totalUsers: users,
      totalDoctors: doctors,
      totalPatients: patients,
      totalAppointments: appointments,
    };
  }

  // 🧑‍⚕️ DOCTOR STATS
  async getDoctorStats() {
    const [pending, approved, rejected] = await Promise.all([
      this.prisma.doctor.count({
        where: { status: DoctorStatus.PENDING },
      }),
      this.prisma.doctor.count({
        where: { status: DoctorStatus.APPROVED },
      }),
      this.prisma.doctor.count({
        where: { status: DoctorStatus.REJECTED },
      }),
    ]);

    return {
      pending,
      approved,
      rejected,
    };
  }

  // 📅 APPOINTMENT STATS
  async getAppointmentStats() {
    const [pending, accepted, rejected, completed] = await Promise.all([
      this.prisma.appointment.count({
        where: { status: AppointmentStatus.PENDING },
      }),
      this.prisma.appointment.count({
        where: { status: AppointmentStatus.ACCEPTED },
      }),
      this.prisma.appointment.count({
        where: { status: AppointmentStatus.REJECTED },
      }),
      this.prisma.appointment.count({
        where: { status: AppointmentStatus.COMPLETED },
      }),
    ]);

    return {
      pending,
      accepted,
      rejected,
      completed,
    };
  }

  // 💳 PAYMENT STATS
  async getPaymentStats() {
    const [pending, paid, failed] = await Promise.all([
      this.prisma.payment.count({
        where: { status: PaymentStatus.PENDING },
      }),
      this.prisma.payment.count({
        where: { status: PaymentStatus.PAID },
      }),
      this.prisma.payment.count({
        where: { status: PaymentStatus.FAILED },
      }),
    ]);

    return {
      pending,
      paid,
      failed,
    };
  }

  // 💰 REVENUE
  async getRevenue() {
    const payments = await this.prisma.payment.findMany({
      where: { status: PaymentStatus.PAID },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalRevenue,
      platformCut: totalRevenue * 0.2,
      doctorPayouts: totalRevenue * 0.8,
    };
  }
}
