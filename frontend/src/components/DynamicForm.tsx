import React, { useEffect, useState } from 'react';
import {
  Controller,
  useForm,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema } from '../../shared/types';
import { api } from '../services/api';
import FormField from './FormField';
import './DynamicForm.css';

interface DynamicFormProps {
  schema?: FormSchema[];
  specialty?: string;
  examinationType?: string;
  onSubmit: SubmitHandler<FieldValues>;
  defaultValues?: FieldValues;
  loading?: boolean;
}

/**
 * Tạo Zod schema từ FormSchema
 */
const createValidationSchema = (formSchemas: FormSchema[]) => {
  const shape: Record<string, any> = {};

  for (const field of formSchemas) {
    let schema: any = z.any();

    // Xác định kiểu dữ liệu
    switch (field.type) {
      case 'number':
        schema = z.coerce.number();
        if (field.validationRules?.min !== undefined) {
          schema = schema.min(field.validationRules.min);
        }
        if (field.validationRules?.max !== undefined) {
          schema = schema.max(field.validationRules.max);
        }
        break;

      case 'date':
        schema = z.string().date();
        break;

      case 'checkbox':
        schema = z.boolean();
        break;

      case 'select':
      case 'textarea':
      case 'text':
      default:
        schema = z.string();
        break;
    }

    // Kiểm tra required
    if (!field.required) {
      schema = schema.optional();
    } else {
      schema = schema.min(1, 'This field is required');
    }

    shape[field.fieldName] = schema;
  }

  return z.object(shape);
};

/**
 * DynamicForm Component
 * Render form dựa trên schema config từ backend hoặc prop tĩnh
 */
const DynamicForm: React.FC<DynamicFormProps> = ({
  schema: staticSchema,
  specialty,
  examinationType,
  onSubmit,
  defaultValues = {},
  loading = false,
}) => {
  const [schema, setSchema] = useState<FormSchema[]>(staticSchema || []);
  const [schemaLoading, setSchemaLoading] = useState(false);

  // Fetch schema từ backend nếu specialty + examinationType được cung cấp
  useEffect(() => {
    if (specialty && examinationType && !staticSchema) {
      setSchemaLoading(true);
      api
        .getFormSchema(specialty, examinationType)
        .then((data) => {
          setSchema(data || []);
        })
        .catch((error) => {
          console.error('Failed to fetch form schema:', error);
          setSchema([]);
        })
        .finally(() => {
          setSchemaLoading(false);
        });
    } else if (staticSchema) {
      setSchema(staticSchema);
    }
  }, [specialty, examinationType, staticSchema]);

  const validationSchema = createValidationSchema(schema);

  const { control, handleSubmit, formState, reset } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
    mode: 'onChange',
  });

  const { errors, isDirty } = formState;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="dynamic-form">
      {schemaLoading && <p className="loading-message">Đang tải form...</p>}
      
      <div className="form-grid">
        {schema.length === 0 && !schemaLoading && (
          <p className="empty-message">Không có trường nào để hiển thị</p>
        )}
        
        {schema.map((field) => (
          <Controller
            key={field.fieldName}
            name={field.fieldName}
            control={control}
            render={({ field: fieldProps }) => (
              <FormField
                {...field}
                {...fieldProps}
                error={errors[field.fieldName]?.message as string}
              />
            )}
          />
        ))}
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading || !isDirty || schemaLoading}
          className="btn-submit"
        >
          {loading ? 'Đang lưu...' : 'Lưu dữ liệu'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          className="btn-reset"
          disabled={!isDirty}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;
