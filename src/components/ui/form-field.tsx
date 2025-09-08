import { forwardRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
}

const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  ({ 
    id, 
    name, 
    label, 
    type = 'text', 
    required = false, 
    value, 
    onChange, 
    placeholder, 
    error, 
    className = '',
    disabled = false,
    autoComplete,
    ...props 
  }, ref) => {
    const fieldId = `field-${id}`;
    const errorId = `error-${id}`;
    
    return (
      <div className={`space-y-2 ${className}`}>
        <Label 
          htmlFor={fieldId} 
          className="block text-sm font-medium text-foreground"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        
        {type === 'textarea' ? (
          <Textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={fieldId}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`w-full min-h-[120px] resize-none transition-all duration-300 focus:scale-[1.02] ${
              error ? 'border-destructive focus:border-destructive' : ''
            }`}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        ) : (
          <Input
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            id={fieldId}
            name={name}
            type={type}
            required={required}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`w-full transition-all duration-300 focus:scale-[1.02] ${
              error ? 'border-destructive focus:border-destructive' : ''
            }`}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        )}
        
        {error && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;