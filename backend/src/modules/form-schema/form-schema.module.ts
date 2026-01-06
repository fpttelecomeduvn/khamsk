import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormSchemaEntity } from './entities/form-schema.entity';
import { FormSchemaService } from './form-schema.service';
import { FormSchemaController } from './form-schema.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FormSchemaEntity])],
  providers: [FormSchemaService],
  controllers: [FormSchemaController],
  exports: [FormSchemaService],
})
export class FormSchemaModule implements OnModuleInit {
  constructor(private readonly formSchemaService: FormSchemaService) {}

  async onModuleInit() {
    // Initialize default form schemas on module startup
    await this.formSchemaService.initializeDefaultSchemas();
  }
}
