import { forwardRef, InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  'form-input w-full rounded-md border border-secondary-300 bg-white px-3 py-2 text-secondary-900 placeholder-secondary-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors',
  {
    variants: {
      error: {
        true: 'border-error-300 focus:border-error-500 focus:ring-error-500',
      },
    },
  }
);

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = 'text', ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-secondary-700">
            {label}
          </label>
        )}
        <input
          type={type}
          className={inputVariants({ error: !!error, className })}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-error-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;