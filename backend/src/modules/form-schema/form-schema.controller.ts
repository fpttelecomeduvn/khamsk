import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FormSchemaService } from './form-schema.service';
import { FormSchemaEntity } from './entities/form-schema.entity';
import { CreateFormSchemaDto, UpdateFormSchemaDto } from './dto/form-schema.dto';
import { FormSchema } from '../shared/types';

@ApiTags('form-schemas')
@Controller('form-schemas')
export class FormSchemaController {
  constructor(private readonly formSchemaService: FormSchemaService) {}

  /**
   * Get form schema for a specialty and examination type
   * GET /form-schemas/:specialty/:examinationType
   */
  @Get(':specialty/:examinationType')
  async getSchema(
    @Param('specialty') specialty: string,
    @Param('examinationType') examinationType: string,
  ): Promise<FormSchema[]> {
    return this.formSchemaService.getSchema(specialty, examinationType);
  }

  /**
   * Get all schemas for an examination type
   * GET /form-schemas/exam/:examinationType
   */
  @Get('exam/:examinationType')
  async getSchemasByExaminationType(
    @Param('examinationType') examinationType: string,
  ): Promise<FormSchemaEntity[]> {
    return this.formSchemaService.getSchemasByExaminationType(examinationType);
  }

  /**
   * Create a new form schema (admin only)
   * POST /form-schemas
   */
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.CREATED)
  async createSchema(@Body() dto: CreateFormSchemaDto): Promise<FormSchemaEntity> {
    return this.formSchemaService.createSchema(dto);
  }

  /**
   * Update a form schema (admin only)
   * PUT /form-schemas/:id
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async updateSchema(
    @Param('id') id: string,
    @Body() dto: UpdateFormSchemaDto,
  ): Promise<FormSchemaEntity> {
    return this.formSchemaService.updateSchema(id, dto);
  }

  /**
   * Delete a form schema (soft delete, admin only)
   * DELETE /form-schemas/:id
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @HttpCode(HttpStatus.OK)
  async deleteSchema(@Param('id') id: string): Promise<void> {
    return this.formSchemaService.deleteSchema(id);
  }

  /**
   * Get all schemas (admin only)
   * GET /form-schemas (admin view)
   */
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async getAllSchemas(): Promise<FormSchemaEntity[]> {
    return this.formSchemaService.getAllSchemas();
  }
}
