import { Button } from '@/components/ui/button'

interface ErrorFallbackProps {
  error?: Error
  onReset: () => void
}

export const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h2 className="text-lg font-semibold text-red-800 mb-2">
      Something went wrong
    </h2>
    <pre className="text-sm text-red-700 mb-4 overflow-auto max-h-64">
      {error?.message}
    </pre>
    <div className="flex gap-2">
      <Button variant="destructive" onClick={onReset}>
        Try Again
      </Button>
      <Button variant="outline" onClick={() => location.reload()}>
        Reload App
      </Button>
    </div>
  </div>
)
