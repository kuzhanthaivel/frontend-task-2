export interface JSONSchema7 {
  type?: string;
  properties?: Record<string, JSONSchema7>;
  required?: string[];
  items?: JSONSchema7;
  enum?: any[];
  title?: string;
  description?: string;
  default?: any;
  format?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  [key: string]: any;
}

export interface DynamicFormProps {
  schema: JSONSchema7;
  onSubmit: (data: any) => void;
  initialValues?: Record<string, any>;
  className?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}