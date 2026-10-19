import { forwardRef } from 'react';
import { Input } from './input';
import { Textarea } from './textarea';
import { Label } from './label';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useAnimationPreferences } from '../motion/preferences';

interface FormFieldProps {
  id: string;
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  valid?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
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
    onBlur,
    valid = false,
    placeholder, 
    error, 
    className = '',
    disabled = false,
    autoComplete,
    ...props 
  }, ref) => {
    const fieldId = `field-${id}`;
    const errorId = `error-${id}`;
    const { reducedMotion } = useAnimationPreferences();
    
    return (
      <div className={`form-field space-y-2 ${className}`} data-filled={!!value}>
        <Label 
          htmlFor={fieldId} 
          className="field-label block text-sm font-medium text-foreground"
        >
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        
        <motion.div className="field-input-wrap" animate={error && !reducedMotion ? { x: [0, -3, 3, -2, 0] } : { x: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3 }}>
        {type === 'textarea' ? (
          <Textarea
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            id={fieldId}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`w-full min-h-[120px] resize-y transition-transform duration-300 ${
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
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={autoComplete}
            className={`w-full transition-transform duration-300 ${
              error ? 'border-destructive focus:border-destructive' : ''
            }`}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        )}
        <AnimatePresence>
          {valid && !error && <motion.span aria-hidden="true" className="field-valid" initial={reducedMotion ? false : { opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }}><CheckCircle2 className="w-4 h-4" /></motion.span>}
        </AnimatePresence>
        </motion.div>
        <div className="field-feedback">
        {error && (
          <motion.p id={errorId} initial={reducedMotion ? false : { opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.2 }} className="field-error text-sm text-destructive" role="alert">
            {error}
          </motion.p>
        )}
        </div>
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
