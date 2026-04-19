import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DoctorStatus } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AdminDoctorService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
  ) {}

  // 📋 LIST
  async getDoctors(status?: string) {
    return this.prisma.doctor.findMany({
      where: status ? { status: status as DoctorStatus } : undefined,
      include: {
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔍 SINGLE
  async getDoctorById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  // ✅ APPROVE
  async approveDoctor(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.status !== DoctorStatus.PENDING) {
      throw new BadRequestException('Doctor already reviewed');
    }

    const updated = await this.prisma.doctor.update({
      where: { id },
      data: { status: DoctorStatus.APPROVED },
    });

    // 🔔 NOTIFY DOCTOR
    await this.notificationService.createNotification(
      doctor.userId,
      'Your profile has been approved',
      'DOCTOR_APPROVED',
    );

    return updated;
  }

  // ❌ REJECT
  async rejectDoctor(id: string, reason: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (doctor.status !== DoctorStatus.PENDING) {
      throw new BadRequestException('Doctor already reviewed');
    }

    const updated = await this.prisma.doctor.update({
      where: { id },
      data: {
        status: DoctorStatus.REJECTED,
        rejectionReason: reason,
      },
    });

    // 🔔 NOTIFY DOCTOR WITH REASON
    await this.notificationService.createNotification(
      doctor.userId,
      `Your profile was rejected: ${reason}`,
      'DOCTOR_REJECTED',
    );

    return updated;
  }
}
