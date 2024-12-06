import { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      "transition-all duration-200 hover:shadow-md",
      className
    )}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}