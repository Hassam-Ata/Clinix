import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class DoctorDashboardService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Helper: get doctor by userId
  private async getDoctor(userId: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return doctor;
  }

  // 📊 1. SUMMARY
  async getSummary(userId: string) {
    const doctor = await this.getDoctor(userId);

    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id },
    });

    const appointmentIds = appointments.map((a) => a.id);

    const payments = await this.prisma.payment.findMany({
      where: {
        appointmentId: { in: appointmentIds },
        status: PaymentStatus.PAID,
      },
    });

    const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(
        (a) => a.status === AppointmentStatus.COMPLETED,
      ).length,
      pendingAppointments: appointments.filter(
        (a) => a.status === AppointmentStatus.PENDING,
      ).length,
      acceptedAppointments: appointments.filter(
        (a) => a.status === AppointmentStatus.ACCEPTED,
      ).length,
      rejectedAppointments: appointments.filter(
        (a) => a.status === AppointmentStatus.REJECTED,
      ).length,
      totalEarnings,
    };
  }

  // 📅 2. TODAY APPOINTMENTS
  async getTodayAppointments(userId: string) {
    const doctor = await this.getDoctor(userId);

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        startTime: {
          gte: start,
          lte: end,
        },
      },
      include: { patient: true },
    });
  }

  // ⏭️ 3. UPCOMING APPOINTMENTS
  async getUpcomingAppointments(userId: string) {
    const doctor = await this.getDoctor(userId);

    return this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: AppointmentStatus.ACCEPTED,
        startTime: { gt: new Date() },
      },
      include: { patient: true },
      orderBy: { startTime: 'asc' },
    });
  }

  // ✅ 4. COMPLETED APPOINTMENTS
  async getCompletedAppointments(userId: string) {
    const doctor = await this.getDoctor(userId);

    return this.prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        status: AppointmentStatus.COMPLETED,
      },
      include: { patient: true },
      orderBy: { startTime: 'desc' },
    });
  }
  // 💰 5. EARNINGS BREAKDOWN
  async getEarnings(userId: string) {
    const doctor = await this.getDoctor(userId);

    const appointments = await this.prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      select: { id: true },
    });

    const appointmentIds = appointments.map((a) => a.id);

    const payments = await this.prisma.payment.findMany({
      where: {
        appointmentId: { in: appointmentIds },
        status: PaymentStatus.PAID,
      },
    });

    const total = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      total,
      platformCut: total * 0.2,
      doctorEarnings: total * 0.8,
    };
  }
}
