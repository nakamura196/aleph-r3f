import { cn } from '@/lib/utils';

export function TabSection({ 
  children,
  className
}: { 
  children: React.ReactNode,
  className?: string
}) {
  return <div className={cn('flex flex-col gap-y-4', className)}>{children}</div>;
}

