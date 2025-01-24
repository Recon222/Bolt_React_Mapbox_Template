import { ErrorBoundary } from '@/components/Error/ErrorBoundary'
import { DebugPanel } from '@/components/Debug/DebugPanel'
import { usePerformanceMonitor } from '@/hooks/usePerformance'

export default function App() {
  usePerformanceMonitor()

  return (
    <ErrorBoundary context="root">
      {/* Existing app content */}
      <DebugPanel />
    </ErrorBoundary>
  )
}
