import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('doctor/availability')
export class AvailabilityController {
  constructor(private service: AvailabilityService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  add(@Req() req, @Body() dto: CreateAvailabilityDto) {
    return this.service.addAvailability(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMy(@Req() req) {
    return this.service.getMyAvailability(req.user.id);
  }

  @Get(':doctorId')
  getByDoctor(@Param('doctorId') doctorId: string) {
    return this.service.getDoctorAvailability(doctorId);
  }
  
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Req() req, @Param('id') id: string) {
    return this.service.deleteAvailability(req.user.id, id);
  }
}
