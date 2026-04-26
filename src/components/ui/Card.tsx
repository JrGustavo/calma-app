import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variantClasses = {
      default: 'bg-bg-secondary border border-border-subtle',
      elevated: 'bg-bg-elevated border border-border shadow-sm',
    }[variant];

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg p-6',
          variantClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
