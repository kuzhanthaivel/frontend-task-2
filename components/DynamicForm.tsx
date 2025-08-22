'use client';

import React, { useState, useCallback } from 'react';
import { JSONSchema7, DynamicFormProps } from '../types/form.types';
import { validateSchema, mergeWithDefaults, validateField } from '../lib/form-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, PlayIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FieldComponentProps {
  name: string;
  schema: JSONSchema7;
  value: any;
  onChange: (value: any) => void;
  onBlur: () => void;
  error?: string;
  required?: boolean;
}

const TextInput: React.FC<FieldComponentProps> = ({ name, schema, value, onChange, onBlur, error, required }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium text-gray-700">
        {schema.title || name}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {schema.description && (
        <p className="text-xs text-gray-500">{schema.description}</p>
      )}
      <Input
        id={name}
        type={schema.format === 'email' ? 'email' : schema.format === 'uri' ? 'url' : 'text'}
        placeholder={schema['ui:placeholder'] || ''}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        className={cn(
          "bg-white border-gray-200 focus:border-gray-400 focus:ring-0 transition-colors",
          error && "border-red-300 focus:border-red-400"
        )}
      />
      {error && (
        <p className="text-xs text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

const FormField: React.FC<FieldComponentProps> = (props) => {
  const { schema } = props;
  
  switch (schema.type) {
    case 'string':
      return <TextInput {...props} />;
    default:
      return <TextInput {...props} />;
  }
};

export const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  onSubmit,
  initialValues,
  className
}) => {
  const [values, setValues] = useState(() => mergeWithDefaults(initialValues || {}, schema));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateAndSetError = useCallback((fieldName: string, fieldValue: any) => {
    const fieldSchema = schema.properties?.[fieldName];
    if (!fieldSchema) return;

    const error = validateField(fieldName, fieldValue, schema);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error || ''
    }));
  }, [schema]);

  const handleChange = useCallback((fieldName: string, value: any) => {
    setValues(prev => ({
      ...prev,
      [fieldName]: value
    }));

    if (touched[fieldName]) {
      validateAndSetError(fieldName, value);
    }
  }, [touched, validateAndSetError]);

  const handleBlur = useCallback((fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    validateAndSetError(fieldName, values[fieldName]);
  }, [values, validateAndSetError]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateSchema(schema, values);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      const touchedMap: Record<string, boolean> = {};
      Object.keys(schema.properties || {}).forEach(field => {
        touchedMap[field] = true;
      });
      setTouched(touchedMap);
      
      return;
    }

    onSubmit(values);
  };

  if (!schema.properties) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No form fields defined in schema
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {Object.entries(schema.properties).map(([fieldName, fieldSchema]) => (
        <FormField
          key={fieldName}
          name={fieldName}
          schema={fieldSchema}
          value={values[fieldName]}
          onChange={(value) => handleChange(fieldName, value)}
          onBlur={() => handleBlur(fieldName)}
          error={errors[fieldName]}
          required={schema.required?.includes(fieldName)}
        />
      ))}
      
      <Button 
        type="submit" 
        className="w-full md:w-auto bg-black text-white hover:bg-gray-800 transition-all duration-150"
        size="default"
      >
        <PlayIcon className="h-2 w-2" />
        Run Workflow
      </Button>
    </form>
  );
};