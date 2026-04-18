import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // -------------------------
  // REGISTER
  // -------------------------
  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create base user
    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
    });

    // If DOCTOR → create doctor profile
    if (dto.role === 'DOCTOR') {
      if (!dto.specialization || !dto.fees || !dto.availability) {
        throw new BadRequestException(
          'Doctor must provide specialization, fees, and availability',
        );
      }

      await this.prisma.doctor.create({
        data: {
          userId: user.id,
          specialization: dto.specialization,
          fees: dto.fees,
          availability: dto.availability,
          document: dto.document || '',
          status: 'PENDING',
        },
      });
    }

    return {
      message: 'User registered successfully',
      userId: user.id,
    };
  }

  // -------------------------
  // LOGIN
  // -------------------------
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { doctor: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign({
      id: user.id,
      role: user.role,
    });

    return {
      access_token: token,
      role: user.role,
      doctorStatus: user.doctor?.status || null,
    };
  }
}
