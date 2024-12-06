import { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  className?: string;
}

export function AuthLayout({ children, className }: AuthLayoutProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col justify-center bg-gradient-radial from-primary-50 via-background to-secondary-50 py-12 px-4 sm:px-6 lg:px-8",
      className
    )}>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-20 w-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full blur-lg opacity-50" />
            <div className="relative h-full w-full rounded-full bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            LawLink
          </h1>
        </div>
        <Card className="mt-8 p-6">
          {children}
        </Card>
      </div>
    </div>
  );
}