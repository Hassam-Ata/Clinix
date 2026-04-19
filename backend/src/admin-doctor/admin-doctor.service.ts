import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DoctorStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  DoctorApprovedEvent,
  DoctorRejectedEvent,
} from '../events/doctor.events';

@Injectable()
export class AdminDoctorService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  // 📋 LIST
  async getDoctors(status?: string) {
    return this.prisma.doctor.findMany({
      where: status ? { status: status as DoctorStatus } : undefined,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔍 SINGLE
  async getDoctorById(id: string) {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
      include: { user: true },
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

    // 🚀 EMIT EVENT (NOT EMAIL DIRECTLY)
    this.eventEmitter.emit(
      'doctor.approved',
      new DoctorApprovedEvent(updated.id, updated.userId),
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

    // 🚀 EMIT EVENT
    this.eventEmitter.emit(
      'doctor.rejected',
      new DoctorRejectedEvent(updated.id, updated.userId, reason),
    );

    return updated;
  }
}
