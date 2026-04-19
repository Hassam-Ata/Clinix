import { Module } from '@nestjs/common';
import { DoctorDashboardService } from './doctor-dashboard.service';
import { DoctorDashboardController } from './doctor-dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [DoctorDashboardService],
  controllers: [DoctorDashboardController],
})
export class DoctorDashboardModule {}
