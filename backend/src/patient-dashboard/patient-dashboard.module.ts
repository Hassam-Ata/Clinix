import { Module } from '@nestjs/common';
import { PatientDashboardService } from './patient-dashboard.service';
import { PatientDashboardController } from './patient-dashboard.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PatientDashboardService],
  controllers: [PatientDashboardController],
})
export class PatientDashboardModule {}
