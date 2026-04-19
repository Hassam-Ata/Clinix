import { Module } from '@nestjs/common';
import { AdminDoctorService } from './admin-doctor.service';
import { AdminDoctorController } from './admin-doctor.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationModule } from '..//notification/notification.module';

@Module({
  imports: [PrismaModule, NotificationModule],
  providers: [AdminDoctorService],
  controllers: [AdminDoctorController],
})
export class AdminDoctorModule {}
