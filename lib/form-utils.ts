import { JSONSchema7 } from '../types/form.types';

export function validateField(fieldName: string, value: any, schema: JSONSchema7): string | null {
  const fieldSchema = schema.properties?.[fieldName];
  if (!fieldSchema) return null;

  if (schema.required?.includes(fieldName) && (!value || (Array.isArray(value) && value.length === 0))) {
    return `${fieldSchema.title || fieldName} is required`;
  }

  if (fieldSchema.type === 'string' && value) {
    if (fieldSchema.minLength && value.length < fieldSchema.minLength) {
      return `Must be at least ${fieldSchema.minLength} characters`;
    }
    if (fieldSchema.maxLength && value.length > fieldSchema.maxLength) {
      return `Must be at most ${fieldSchema.maxLength} characters`;
    }
    if (fieldSchema.pattern && !new RegExp(fieldSchema.pattern).test(value)) {
      return `Invalid format`;
    }
    if (fieldSchema.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return `Must be a valid email address`;
    }
    if (fieldSchema.format === 'uri' && !/^https?:\/\/.+/.test(value)) {
      return `Must be a valid URL`;
    }
  }

  if (fieldSchema.type === 'number' && value !== undefined) {
    if (fieldSchema.minimum && value < fieldSchema.minimum) {
      return `Must be at least ${fieldSchema.minimum}`;
    }
    if (fieldSchema.maximum && value > fieldSchema.maximum) {
      return `Must be at most ${fieldSchema.maximum}`;
    }
  }

  if (fieldSchema.type === 'array' && value) {
    if (fieldSchema.minItems && value.length < fieldSchema.minItems) {
      return `Must have at least ${fieldSchema.minItems} items`;
    }
    if (fieldSchema.maxItems && value.length > fieldSchema.maxItems) {
      return `Must have at most ${fieldSchema.maxItems} items`;
    }
  }

  return null;
}

export function validateSchema(schema: JSONSchema7, values: Record<string, any>): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!schema.properties) return errors;

  Object.keys(schema.properties).forEach(fieldName => {
    const error = validateField(fieldName, values[fieldName], schema);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
}

export function mergeWithDefaults(values: Record<string, any>, schema: JSONSchema7): Record<string, any> {
  const merged = { ...values };
  
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([key, fieldSchema]) => {
      if (merged[key] === undefined && fieldSchema.default !== undefined) {
        merged[key] = fieldSchema.default;
      }
    });
  }
  
  return merged;
}