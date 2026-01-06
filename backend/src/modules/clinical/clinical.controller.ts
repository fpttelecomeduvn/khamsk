import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClinicalService } from './clinical.service';
import { UpdateClinicalDataDto, OverrideHealthRankDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/guards/roles.guard';
import { UserRole } from '../../../../shared/types';

@ApiTags('Clinical Data & Examination')
@Controller('clinical')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClinicalController {
  private readonly logger = new Logger(ClinicalController.name);

  constructor(private clinicalService: ClinicalService) {}

  /**
   * GET /clinical/sessions/:sessionId - Lấy session khám
   */
  @Get('sessions/:sessionId')
  @ApiOperation({ summary: 'Get health check session details' })
  async getSession(@Param('sessionId') sessionId: string) {
    return this.clinicalService.getSessionById(sessionId);
  }

  /**
   * PUT /clinical/sessions/:sessionId/data - Cập nhật dữ liệu lâm sàng
   */
  @Put('sessions/:sessionId/data')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.DOCTOR, UserRole.TECHNICIAN)
  @ApiOperation({ summary: 'Update clinical data for a specialty' })
  async updateClinicalData(
    @Param('sessionId') sessionId: string,
    @Body() dto: UpdateClinicalDataDto,
    @Request() req,
  ) {
    this.logger.log(
      `Updating clinical data for session ${sessionId}, specialty ${dto.specialty}`,
    );
    return this.clinicalService.updateClinicalData(sessionId, dto, req.user.id);
  }

  /**
   * POST /clinical/sessions/:sessionId/calculate-rank - Tính xếp loại
   */
  @Post('sessions/:sessionId/calculate-rank')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.DOCTOR, UserRole.CHIEF_DOCTOR)
  @ApiOperation({ summary: 'Calculate health rank automatically' })
  async calculateHealthRank(@Param('sessionId') sessionId: string) {
    this.logger.log(`Calculating health rank for session ${sessionId}`);
    return this.clinicalService.calculateHealthRank(sessionId);
  }

  /**
   * POST /clinical/sessions/:sessionId/override-rank - Ghi đè xếp loại
   */
  @Post('sessions/:sessionId/override-rank')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.CHIEF_DOCTOR, UserRole.ADMIN)
  @ApiOperation({ summary: 'Override final health rank with reason' })
  async overrideHealthRank(
    @Param('sessionId') sessionId: string,
    @Body() dto: OverrideHealthRankDto,
    @Request() req,
  ) {
    this.logger.log(
      `Overriding health rank for session ${sessionId}, reason: ${dto.reason}`,
    );
    return this.clinicalService.overrideHealthRank(sessionId, dto, req.user.id);
  }

  /**
   * POST /clinical/sessions/:sessionId/complete - Hoàn thành session
   */
  @Post('sessions/:sessionId/complete')
  @HttpCode(HttpStatus.OK)
  @Roles(UserRole.DOCTOR, UserRole.CHIEF_DOCTOR)
  @ApiOperation({ summary: 'Mark session as completed' })
  async completeSession(
    @Param('sessionId') sessionId: string,
    @Request() req,
  ) {
    this.logger.log(`Completing session ${sessionId}`);
    return this.clinicalService.completeSession(sessionId, req.user.id);
  }

  /**
   * GET /clinical/patients/:patientId/sessions - Lấy lịch sử khám bệnh nhân
   */
  @Get('patients/:patientId/sessions')
  @ApiOperation({ summary: 'Get all examination sessions for a patient' })
  async getPatientSessions(@Param('patientId') patientId: string) {
    return this.clinicalService.getPatientSessions(patientId);
  }

  /**
   * GET /clinical/batches/:batchId/incomplete - Lấy sessions chưa hoàn thành
   */
  @Get('batches/:batchId/incomplete')
  @ApiOperation({ summary: 'Get incomplete sessions in batch' })
  async getIncompleteSessions(@Param('batchId') batchId: string) {
    return this.clinicalService.getIncompleteSessions(batchId);
  }

  /**
   * GET /clinical/batches/:batchId/statistics - Thống kê xếp loại
   */
  @Get('batches/:batchId/statistics')
  @ApiOperation({ summary: 'Get health rank statistics for batch' })
  async getStatistics(@Param('batchId') batchId: string) {
    return this.clinicalService.getHealthRankStatistics(batchId);
  }
}
