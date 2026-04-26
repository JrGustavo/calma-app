import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

/**
 * Button
 *
 * All variants use neutral cream/gray fills with subtle borders.
 * NO colored fills (no blue/green/red buttons) — that would violate the
 * design system. Petroleum blue is reserved for grammar markers only.
 *
 * Minimum tap target: 44px (WCAG AAA).
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const sizeClasses = {
      md: 'min-h-[44px] px-5 text-base',
      lg: 'min-h-[52px] px-6 text-lg',
    }[size];

    const variantClasses = {
      primary: cn(
        'bg-bg-elevated border border-border',
        'text-text-primary',
        'hover:bg-bg-secondary hover:border-text-muted',
        'active:bg-bg-alt'
      ),
      secondary: cn(
        'bg-transparent border border-border',
        'text-text-primary',
        'hover:bg-bg-secondary',
        'active:bg-bg-alt'
      ),
      ghost: cn(
        'bg-transparent border border-transparent',
        'text-text-secondary',
        'hover:text-text-primary hover:bg-bg-secondary'
      ),
    }[variant];

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'rounded-md font-medium',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          sizeClasses,
          variantClasses,
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
