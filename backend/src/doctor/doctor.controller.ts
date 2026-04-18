import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CurrentUser as CurrentUserType } from '../auth/types/current-user.type';
import { DoctorSearchDto } from './dto/search-doctor.dto';

@Controller('doctor')
export class DoctorController {
  constructor(private doctorService: DoctorService) {}

  @Get('search')
  searchDoctors(@Query() dto: DoctorSearchDto) {
    return this.doctorService.searchDoctors(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('onboard')
  createProfile(
    @CurrentUser() user: CurrentUserType,
    @Body() dto: CreateDoctorDto,
  ) {
    return this.doctorService.createDoctorProfile(user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@CurrentUser() user: CurrentUserType) {
    return this.doctorService.getMyProfile(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMyProfile(
    @CurrentUser() user: CurrentUserType,
    @Body() dto: UpdateDoctorDto,
  ) {
    return this.doctorService.updateDoctorProfile(user.id, dto);
  }

  @Get('all')
  getAllDoctors() {
    return this.doctorService.getAllDoctors();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('approve/:id')
  approve(@Param('id') id: string) {
    return this.doctorService.approveDoctor(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('reject/:id')
  reject(@Param('id') id: string) {
    return this.doctorService.rejectDoctor(id);
  }
}
