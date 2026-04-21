import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { DoctorStatus } from '@prisma/client';
import { DoctorSearchDto } from './dto/search-doctor.dto';

@Injectable()
export class DoctorService {
  constructor(private prisma: PrismaService) {}

  async createDoctorProfile(userId: string, dto: CreateDoctorDto) {
    const existing = await this.prisma.doctor.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException(
        'Doctor record not found. Please register first.',
      );
    }

    if (existing.specialization) {
      throw new ForbiddenException('Doctor profile has already been onboarded');
    }

    return this.prisma.doctor.update({
      where: { userId },
      data: {
        specialization: dto.specialization,
        fees: dto.fees,
        documentUrl: dto.documentUrl,
        status: DoctorStatus.PENDING,
      },
    });
  }

  async searchDoctors(dto: DoctorSearchDto) {
    const page = Number(dto.page ?? 1);
    const limit = Number(dto.limit ?? 10);
    const skip = (page - 1) * limit;

    return this.prisma.doctor.findMany({
      where: {
        status: 'APPROVED',

        ...(dto.specialization && {
          specialization: dto.specialization,
        }),

        ...(dto.minFees || dto.maxFees
          ? {
              fees: {
                gte: dto.minFees,
                lte: dto.maxFees,
              },
            }
          : {}),
      },

      include: {
        user: true,
        availability: true,
      },

      skip,
      take: limit,

      orderBy: {
        [dto.sortBy ?? 'createdAt']: dto.order ?? 'desc',
      },
    });
  }

  async getMyProfile(userId: string) {
    return this.prisma.doctor.findUnique({
      where: { userId },
      include: { user: true, availability: true },
    });
  }

  async updateDoctorProfile(userId: string, dto: UpdateDoctorDto) {
    return this.prisma.doctor.update({
      where: { userId },
      data: {
        ...(dto.specialization !== undefined && {
          specialization: dto.specialization,
        }),
        ...(dto.fees !== undefined && { fees: dto.fees }),
        ...(dto.documentUrl !== undefined && { documentUrl: dto.documentUrl }),
      },
    });
  }

  async getAllDoctors() {
    return this.prisma.doctor.findMany({
      where: { status: DoctorStatus.APPROVED },
      include: { user: true, availability: true },
    });
  }

  async approveDoctor(doctorId: string) {
    return this.prisma.doctor.update({
      where: { id: doctorId },
      data: { status: DoctorStatus.APPROVED },
    });
  }

  async rejectDoctor(doctorId: string) {
    return this.prisma.doctor.update({
      where: { id: doctorId },
      data: { status: DoctorStatus.REJECTED },
    });
  }
}
