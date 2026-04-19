import { Controller, Get, UseGuards } from '@nestjs/common';
import { AdminDashboardService } from './admin-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class AdminDashboardController {
  constructor(private readonly service: AdminDashboardService) {}

  // 📊 OVERVIEW
  @Get('overview')
  getOverview() {
    return this.service.getOverview();
  }

  // 🧑‍⚕️ DOCTORS
  @Get('doctors')
  getDoctorStats() {
    return this.service.getDoctorStats();
  }

  // 📅 APPOINTMENTS
  @Get('appointments')
  getAppointmentStats() {
    return this.service.getAppointmentStats();
  }

  // 💳 PAYMENTS
  @Get('payments')
  getPaymentStats() {
    return this.service.getPaymentStats();
  }

  // 💰 REVENUE
  @Get('revenue')
  getRevenue() {
    return this.service.getRevenue();
  }
}
