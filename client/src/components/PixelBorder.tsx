import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PixelBorderProps extends HTMLAttributes<HTMLDivElement> {
  background?: 'red' | 'green' | 'yellow' | 'blue' | 'white' | 'black' | 'transparent';
}

const PixelBorder = forwardRef<HTMLDivElement, PixelBorderProps>(
  ({ className, background = 'transparent', children, ...props }, ref) => {
    const bgClasses = {
      red: 'bg-[#E52521]',
      green: 'bg-[#43B047]',
      yellow: 'bg-[#FBD000]',
      blue: 'bg-[#5C94FC]',
      white: 'bg-white',
      black: 'bg-black',
      transparent: 'bg-transparent'
    };
    
    return (
      <div
        className={cn(
          'pixel-border',
          bgClasses[background],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

PixelBorder.displayName = 'PixelBorder';

export default PixelBorder;
