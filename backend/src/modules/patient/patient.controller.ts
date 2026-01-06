import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import {
  CreatePatientDto,
  UpdatePatientDto,
  PatientBulkImportDto,
  CreateBatchDto,
  PatientResponseDto,
  BatchResponseDto,
  BulkImportResponseDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Patients & Batches')
@Controller('patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class PatientController {
  private readonly logger = new Logger(PatientController.name);

  constructor(private patientService: PatientService) {}

  /**
   * ============ PATIENT ENDPOINTS ============
   */

  /**
   * POST /patients - Tạo bệnh nhân mới
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new patient' })
  @ApiResponse({ status: 201, type: PatientResponseDto })
  async createPatient(@Body() dto: CreatePatientDto) {
    this.logger.log(`Creating patient: ${dto.fullName}`);
    const patient = await this.patientService.createPatient(dto);
    return this.toPatientResponseDto(patient);
  }

  /**
   * GET /patients - Lấy danh sách bệnh nhân (phân trang)
   */
  @Get()
  @ApiOperation({ summary: 'Get all patients with pagination' })
  @ApiResponse({ status: 200, isArray: true })
  async getAllPatients(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    const result = await this.patientService.getAllPatients(page, limit);
    return {
      ...result,
      items: result.items.map((p) => this.toPatientResponseDto(p)),
    };
  }

  /**
   * GET /patients/search - Tìm kiếm bệnh nhân
   */
  @Get('search')
  @ApiOperation({ summary: 'Search patients by name or ID number' })
  async searchPatients(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    if (!query) {
      throw new BadRequestException('Search query is required');
    }

    const result = await this.patientService.searchPatients(query, page, limit);
    return {
      ...result,
      items: result.items.map((p) => this.toPatientResponseDto(p)),
    };
  }

  /**
   * GET /patients/:id - Lấy thông tin bệnh nhân
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get patient details' })
  @ApiResponse({ status: 200, type: PatientResponseDto })
  async getPatient(@Param('id') id: string) {
    const patient = await this.patientService.getPatientById(id);
    return this.toPatientResponseDto(patient);
  }

  /**
   * GET /patients/:id/history - Lấy lịch sử khám bệnh nhân
   */
  @Get(':id/history')
  @ApiOperation({ summary: 'Get patient examination history' })
  async getPatientHistory(@Param('id') id: string) {
    return this.patientService.getPatientExaminationHistory(id);
  }

  /**
   * PUT /patients/:id - Cập nhật bệnh nhân
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update patient information' })
  @ApiResponse({ status: 200, type: PatientResponseDto })
  async updatePatient(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto,
  ) {
    const patient = await this.patientService.updatePatient(id, dto);
    return this.toPatientResponseDto(patient);
  }

  /**
   * ============ BATCH ENDPOINTS ============
   */

  /**
   * POST /patients/batches - Tạo đợt khám mới
   */
  @Post('batches')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new examination batch' })
  @ApiResponse({ status: 201, type: BatchResponseDto })
  async createBatch(@Body() dto: CreateBatchDto, @Request() req) {
    this.logger.log(`Creating batch: ${dto.batchName}`);
    const batch = await this.patientService.createBatch(dto, req.user.id);
    return this.toBatchResponseDto(batch);
  }

  /**
   * GET /patients/batches/:id - Lấy thông tin đợt khám
   */
  @Get('batches/:id')
  @ApiOperation({ summary: 'Get batch details' })
  @ApiResponse({ status: 200, type: BatchResponseDto })
  async getBatch(@Param('id') id: string) {
    const batch = await this.patientService.getBatchById(id);
    return this.toBatchResponseDto(batch);
  }

  /**
   * GET /patients/batches/:id/pending - Lấy danh sách bệnh nhân chờ khám trong đợt
   */
  @Get('batches/:id/pending')
  @ApiOperation({ summary: 'Get pending patients in batch' })
  async getPendingPatients(@Param('id') id: string) {
    return this.patientService.getPendingPatientsByBatch(id);
  }

  /**
   * POST /patients/batches/:id/lock - Khóa đợt khám
   */
  @Post('batches/:id/lock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lock batch (prevent further modifications)' })
  async lockBatch(@Param('id') id: string, @Request() req) {
    this.logger.log(`Locking batch: ${id}`);
    const batch = await this.patientService.lockBatch(id, req.user.id);
    return this.toBatchResponseDto(batch);
  }

  /**
   * ============ BULK IMPORT ============
   */

  /**
   * POST /patients/bulk-import - Import nhiều bệnh nhân cùng lúc
   */
  @Post('bulk-import')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Bulk import patients from Excel or JSON' })
  @ApiResponse({ status: 201, type: BulkImportResponseDto })
  async bulkImport(
    @Body() dto: PatientBulkImportDto,
    @Request() req,
  ): Promise<BulkImportResponseDto> {
    this.logger.log(
      `Bulk importing ${dto.patients.length} patients for batch: ${dto.batchName}`,
    );

    if (dto.patients.length === 0) {
      throw new BadRequestException('Patient list cannot be empty');
    }

    if (dto.patients.length > 1000) {
      throw new BadRequestException(
        'Maximum 1000 patients per import is allowed',
      );
    }

    return this.patientService.bulkImportPatients(dto, req.user.id);
  }

  /**
   * ============ HELPER METHODS ============
   */

  private toPatientResponseDto(patient: any): PatientResponseDto {
    return {
      id: patient.id,
      fullName: patient.fullName,
      dateOfBirth: patient.dateOfBirth?.toISOString().split('T')[0],
      gender: patient.gender,
      idNumber: patient.idNumber,
      insuranceCard: patient.insuranceCard,
      phone: patient.phone,
      company: patient.company,
      position: patient.position,
      address: patient.address,
      createdAt: patient.createdAt?.toISOString(),
      updatedAt: patient.updatedAt?.toISOString(),
    };
  }

  private toBatchResponseDto(batch: any): BatchResponseDto {
    return {
      id: batch.id,
      batchName: batch.batchName,
      batchDate: batch.batchDate?.toISOString().split('T')[0],
      examinationType: batch.examinationType,
      totalPatients: batch.totalPatients,
      completedCount: batch.completedCount,
      isLocked: batch.isLocked,
      createdAt: batch.createdAt?.toISOString(),
    };
  }
}
