import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AdminDoctorService } from './admin-doctor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RejectDoctorDto } from './dto/reject-doctor.dto';

@Controller('admin/doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDoctorController {
  constructor(private readonly service: AdminDoctorService) {}

  // 📋 LIST
  @Get()
  getDoctors(@Query('status') status?: string) {
    return this.service.getDoctors(status);
  }

  // 🔍 SINGLE
  @Get(':id')
  getDoctor(@Param('id') id: string) {
    return this.service.getDoctorById(id);
  }

  // ✅ APPROVE
  @Patch(':id/approve')
  approveDoctor(@Param('id') id: string) {
    return this.service.approveDoctor(id);
  }

  // ❌ REJECT
  @Patch(':id/reject')
  rejectDoctor(@Param('id') id: string, @Body() dto: RejectDoctorDto) {
    return this.service.rejectDoctor(id, dto.reason);
  }
}
