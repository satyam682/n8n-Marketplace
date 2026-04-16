import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-neo-black text-neo-white hover:bg-zinc-800',
      secondary: 'bg-neo-white text-neo-black border-2 border-neo-black',
      outline: 'bg-transparent border-2 border-neo-black text-neo-black hover:bg-neo-gray',
      ghost: 'bg-transparent text-neo-black hover:bg-neo-gray border-none shadow-none',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-6 py-2.5 text-base',
      lg: 'px-8 py-4 text-lg',
      icon: 'p-2',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'neo-interactive neo-shadow-sm font-bold uppercase tracking-tight inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          variant !== 'ghost' && 'neo-border',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button };
