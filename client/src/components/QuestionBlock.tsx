import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface QuestionBlockProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const QuestionBlock = forwardRef<HTMLDivElement, QuestionBlockProps>(
  ({ className, size = 'md', animate = true, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-base',
      lg: 'w-16 h-16 text-xl'
    };
    
    return (
      <div
        className={cn(
          'bg-[#FBD000] flex items-center justify-center',
          animate && 'animate-[flash_1s_infinite]',
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children || <span className="font-pixel text-black">?</span>}
      </div>
    );
  }
);

QuestionBlock.displayName = 'QuestionBlock';

export default QuestionBlock;
