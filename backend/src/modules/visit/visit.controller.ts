import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { VisitService } from './visit.service';
import { VisitEntity } from './entities/visit.entity';
import { CreateVisitDto, CompleteVisitDto } from './dto/visit.dto';

@ApiTags('visits')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visits')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  /**
   * Create a new health check session
   * POST /visits/sessions
   */
  @Post('sessions')
  @Roles('DOCTOR', 'CHIEF_DOCTOR', 'RECEPTIONIST', 'ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createSession(@Body() dto: CreateVisitDto): Promise<VisitEntity> {
    return this.visitService.createSession(dto);
  }

  /**
   * Get a specific session by ID
   * GET /visits/sessions/:id
   */
  @Get('sessions/:id')
  @Roles('DOCTOR', 'CHIEF_DOCTOR', 'RECEPTIONIST', 'ADMIN')
  async getSession(@Param('id') id: string): Promise<VisitEntity> {
    return this.visitService.getSession(id);
  }

  /**
   * Get all sessions for a patient
   * GET /visits/patients/:patientId/sessions
   */
  @Get('patients/:patientId/sessions')
  @Roles('DOCTOR', 'CHIEF_DOCTOR', 'RECEPTIONIST', 'ADMIN')
  async getPatientSessions(@Param('patientId') patientId: string): Promise<VisitEntity[]> {
    return this.visitService.getPatientSessions(patientId);
  }

  /**
   * Get all sessions in a batch
   * GET /visits/batches/:batchId/sessions
   */
  @Get('batches/:batchId/sessions')
  @Roles('DOCTOR', 'CHIEF_DOCTOR', 'RECEPTIONIST', 'ADMIN')
  async getBatchSessions(@Param('batchId') batchId: string): Promise<VisitEntity[]> {
    return this.visitService.getBatchSessions(batchId);
  }

  /**
   * Update clinical data for a specific specialty
   * PUT /visits/sessions/:id/clinical-data
   */
  @Put('sessions/:id/clinical-data')
  @Roles('DOCTOR', 'CHIEF_DOCTOR')
  async updateClinicalData(
    @Param('id') id: string,
    @Body() body: { specialty: string; data: Record<string, any> },
  ): Promise<VisitEntity> {
    return this.visitService.updateSessionClinicalData(id, body.specialty, body.data);
  }

  /**
   * Update specialty rank after calculation
   * PUT /visits/sessions/:id/specialty-rank
   */
  @Put('sessions/:id/specialty-rank')
  @Roles('DOCTOR', 'CHIEF_DOCTOR')
  async updateSpecialtyRank(
    @Param('id') id: string,
    @Body() body: { specialty: string; rank: number },
  ): Promise<VisitEntity> {
    return this.visitService.updateSpecialtyRank(id, body.specialty, body.rank);
  }

  /**
   * Complete a session and set final health rank
   * PUT /visits/sessions/:id/complete
   */
  @Put('sessions/:id/complete')
  @Roles('CHIEF_DOCTOR', 'ADMIN')
  async completeSession(
    @Param('id') id: string,
    @Body() dto: CompleteVisitDto,
  ): Promise<VisitEntity> {
    return this.visitService.completeSession(id, dto);
  }

  /**
   * Cancel a session
   * DELETE /visits/sessions/:id
   */
  @Delete('sessions/:id')
  @Roles('CHIEF_DOCTOR', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async cancelSession(@Param('id') id: string): Promise<VisitEntity> {
    return this.visitService.cancelSession(id);
  }

  /**
   * Get session statistics for a batch
   * GET /visits/batches/:batchId/statistics
   */
  @Get('batches/:batchId/statistics')
  @Roles('CHIEF_DOCTOR', 'ADMIN')
  async getStatistics(
    @Param('batchId') batchId: string,
  ): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    cancelled: number;
    rankDistribution: Record<string, number>;
  }> {
    return this.visitService.getSessionStatistics(batchId);
  }
}
