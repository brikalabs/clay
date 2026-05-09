import * as React from 'react';

import { cn } from '../../primitives/cn';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'input corner-themed w-full min-w-0 rounded-input border-input-border bg-input-container text-base text-input-label shadow-surface outline-none transition-[color,box-shadow] backdrop-blur-input selection:bg-input-selection-container selection:text-input-selection-label file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-input-file-label file:text-sm placeholder:text-input-placeholder disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:ring-themed',
        'aria-invalid:border-input-invalid-border',
        className
      )}
      {...props}
    />
  );
}

export { Input };
