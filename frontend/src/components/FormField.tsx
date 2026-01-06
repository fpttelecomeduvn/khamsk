import React from 'react';
import { FormSchema } from '../../shared/types';
import './FormField.css';

interface FormFieldProps extends FormSchema {
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error?: string;
}

/**
 * FormField Component - Render từng field theo type
 */
const FormField: React.FC<FormFieldProps> = ({
  fieldName,
  label,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  options,
  error,
  required,
  hint,
}) => {
  return (
    <div className={`form-field ${error ? 'form-field--error' : ''}`}>
      <label htmlFor={fieldName} className="form-label">
        {label}
        {required && <span className="required">*</span>}
      </label>

      {type === 'text' && (
        <input
          id={fieldName}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="form-control"
        />
      )}

      {type === 'number' && (
        <input
          id={fieldName}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value ? Number(e.target.value) : '')}
          onBlur={onBlur}
          placeholder={placeholder}
          className="form-control"
        />
      )}

      {type === 'date' && (
        <input
          id={fieldName}
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="form-control"
        />
      )}

      {type === 'select' && (
        <select
          id={fieldName}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="form-control"
        >
          <option value="">-- Chọn --</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}

      {type === 'checkbox' && (
        <div className="form-checkbox">
          <input
            id={fieldName}
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            onBlur={onBlur}
            className="form-control-checkbox"
          />
          <label htmlFor={fieldName} className="checkbox-label">
            {label}
          </label>
        </div>
      )}

      {type === 'textarea' && (
        <textarea
          id={fieldName}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="form-control form-textarea"
          rows={4}
        />
      )}

      {hint && <div className="form-hint">{hint}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
};

export default FormField;
