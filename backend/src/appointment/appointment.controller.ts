import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CompleteAppointmentDto } from './dto/complete-appointment.dto';

@Controller('appointment')
export class AppointmentController {
  constructor(private service: AppointmentService) {}

  // 👤 PATIENT BOOKS
  @UseGuards(JwtAuthGuard)
  @Post()
  book(@Req() req, @Body() dto: CreateAppointmentDto) {
    return this.service.createAppointment(req.user.id, dto);
  }

  // 👤 PATIENT VIEW
  @UseGuards(JwtAuthGuard)
  @Get('my')
  myAppointments(@Req() req) {
    return this.service.getMyAppointments(req.user.id);
  }

  // 🧑‍⚕️ DOCTOR VIEW
  @UseGuards(JwtAuthGuard)
  @Get('doctor')
  doctorAppointments(@Req() req) {
    return this.service.getDoctorAppointments(req.user.id);
  }

  // 🧑‍⚕️ UPDATE STATUS
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateAppointmentStatusDto,
  ) {
    return this.service.updateStatus(req.user.id, id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/complete')
  completeAppointment(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: CompleteAppointmentDto,
  ) {
    return this.service.completeAppointment(req.user.id, id, dto);
  }
  @UseGuards(JwtAuthGuard)
  @Patch(':id/cancel')
  cancel(@Req() req, @Param('id') id: string) {
    return this.service.cancelAppointment(req.user.id, id);
  }
}
