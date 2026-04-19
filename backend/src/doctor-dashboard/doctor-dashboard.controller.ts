import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DoctorDashboardService } from './doctor-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('doctor/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DOCTOR')
export class DoctorDashboardController {
  constructor(private readonly dashboardService: DoctorDashboardService) {}

  // 📊 SUMMARY
  @Get('summary')
  getSummary(@Req() req) {
    return this.dashboardService.getSummary(req.user.id);
  }

  // 📅 TODAY
  @Get('today')
  getToday(@Req() req) {
    return this.dashboardService.getTodayAppointments(req.user.id);
  }

  // ⏭️ UPCOMING
  @Get('upcoming')
  getUpcoming(@Req() req) {
    return this.dashboardService.getUpcomingAppointments(req.user.id);
  }

  // ✅ COMPLETED
  @Get('completed')
  getCompleted(@Req() req) {
    return this.dashboardService.getCompletedAppointments(req.user.id);
  }

  // 💰 EARNINGS
  @Get('earnings')
  getEarnings(@Req() req) {
    return this.dashboardService.getEarnings(req.user.id);
  }
}
