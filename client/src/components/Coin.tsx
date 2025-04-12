import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CoinProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const Coin = forwardRef<HTMLDivElement, CoinProps>(
  ({ className, size = 'md', animate = true, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8'
    };
    
    return (
      <div
        className={cn(
          'bg-[#FFCF40] rounded-full',
          animate && 'animate-coin-spin',
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Coin.displayName = 'Coin';

export default Coin;
