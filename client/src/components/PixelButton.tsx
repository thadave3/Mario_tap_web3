import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'red' | 'green' | 'yellow' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  ({ className, variant = 'red', size = 'md', children, ...props }, ref) => {
    const variantClasses = {
      red: 'bg-[#E52521] text-white hover:bg-[#D41C17]',
      green: 'bg-[#43B047] text-white hover:bg-[#3A9A3E]',
      yellow: 'bg-[#FBD000] text-black hover:bg-[#EBC000]',
      blue: 'bg-[#5B6EE1] text-white hover:bg-[#4A5ED0]'
    };
    
    const sizeClasses = {
      sm: 'py-2 px-4 text-xs',
      md: 'py-3 px-6 text-sm',
      lg: 'py-4 px-8 text-base'
    };
    
    return (
      <button
        className={cn(
          'font-pixel pixel-border transition-transform active:scale-95',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PixelButton.displayName = 'PixelButton';

export default PixelButton;
