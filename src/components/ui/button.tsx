import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Button = ({ className, ...props }: ButtonProps) => (
  <button
    className={cn(
      'inline-flex items-center justify-center rounded-md',
      'px-4 py-2 text-sm font-medium transition-colors',
      'bg-map-primary text-white hover:bg-map-primary/90',
      'focus-visible:outline-none focus-visible:ring-2',
      'focus-visible:ring-map-primary/80',
      className
    )}
    {...props}
  />
)
