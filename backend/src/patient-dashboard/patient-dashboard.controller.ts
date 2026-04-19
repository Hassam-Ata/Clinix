import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { PatientDashboardService } from './patient-dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('patient/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PATIENT')
export class PatientDashboardController {
  constructor(private readonly service: PatientDashboardService) {}

  // 📊 SUMMARY
  @Get('summary')
  getSummary(@Req() req) {
    return this.service.getSummary(req.user.id);
  }

  // 📅 UPCOMING
  @Get('upcoming')
  getUpcoming(@Req() req) {
    return this.service.getUpcomingAppointments(req.user.id);
  }

  // 📜 HISTORY
  @Get('history')
  getHistory(@Req() req) {
    return this.service.getAppointmentHistory(req.user.id);
  }

  // 💳 PAYMENTS
  @Get('payments')
  getPayments(@Req() req) {
    return this.service.getPayments(req.user.id);
  }

  // 📊 SPENDING
  @Get('spending')
  getSpending(@Req() req) {
    return this.service.getSpending(req.user.id);
  }
}
