import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class PatientDashboardService {
  constructor(private prisma: PrismaService) {}

  // 🔹 helper
  private async getPatient(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  // 📊 SUMMARY
  async getSummary(userId: string) {
    const user = await this.getPatient(userId);

    const appointments = await this.prisma.appointment.findMany({
      where: { patientId: user.id },
    });

    const appointmentIds = appointments.map((a) => a.id);

    const payments = await this.prisma.payment.findMany({
      where: {
        appointmentId: { in: appointmentIds },
        status: PaymentStatus.PAID,
      },
    });

    const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

    return {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(
        (a) => a.status === AppointmentStatus.COMPLETED,
      ).length,
      upcomingAppointments: appointments.filter(
        (a) => a.status === AppointmentStatus.ACCEPTED,
      ).length,
      totalSpent,
    };
  }

  // 📅 UPCOMING
  async getUpcomingAppointments(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        patientId: userId,
        status: {
          in: [AppointmentStatus.ACCEPTED],
        },
        startTime: { gte: new Date() },
      },
      include: {
        doctor: {
          include: { user: true },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  // 📜 HISTORY
  async getAppointmentHistory(userId: string) {
    return this.prisma.appointment.findMany({
      where: {
        patientId: userId,
        status: AppointmentStatus.COMPLETED,
      },
      include: {
        doctor: {
          include: { user: true },
        },
      },
      orderBy: { startTime: 'desc' },
    });
  }

  // 💳 PAYMENTS
  async getPayments(userId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId: userId },
      select: { id: true },
    });

    const appointmentIds = appointments.map((a) => a.id);

    const payments = await this.prisma.payment.findMany({
      where: {
        appointmentId: { in: appointmentIds },
        status: PaymentStatus.PAID,
      },
      orderBy: { createdAt: 'desc' },
    });

    const appointmentMap = new Map(
      (
        await this.prisma.appointment.findMany({
          where: { id: { in: payments.map((p) => p.appointmentId) } },
          select: {
            id: true,
            startTime: true,
            status: true,
            doctor: {
              select: {
                id: true,
                specialization: true,
                user: true,
              },
            },
          },
        })
      ).map((a) => [a.id, a]),
    );

    return payments.map((payment) => ({
      id: payment.id,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      appointment: appointmentMap.get(payment.appointmentId) ?? null,
    }));
  }

  // 📊 SPENDING
  async getSpending(userId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { patientId: userId },
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
      totalSpent: total,
      totalPayments: payments.length,
    };
  }
}
