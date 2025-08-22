import { JSONSchema7 } from '@/types/form.types';

export function convertToJSONSchema7(inputSchema: Record<string, any>): JSONSchema7 {
  const properties: Record<string, JSONSchema7> = {};
  const required: string[] = [];
  
  Object.entries(inputSchema).forEach(([key, field]: [string, any]) => {
    const property: JSONSchema7 = {
      type: field.type || 'string',
      title: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: field.description
    };
    
    if (field.enum) {
      property.enum = field.enum;
      property['ui:widget'] = 'select';
    }
    
    properties[key] = property;
    
    if (field.required) {
      required.push(key);
    }
  });
  
  return {
    type: 'object',
    properties,
    required: required.length > 0 ? required : undefined
  };
}