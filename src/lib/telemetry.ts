type ErrorSeverity = 'critical' | 'error' | 'warning' | 'info'

interface ErrorContext {
  type: string
  context?: string
  stack?: string
  component?: string
}

export function captureError(error: Error, context: ErrorContext) {
  const payload = {
    severity: determineSeverity(error),
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    ...context
  }

  // In production: sendToTelemetryService(payload)
  console.error('Captured Error:', payload)
  logToStore(payload)
}

function determineSeverity(error: Error): ErrorSeverity {
  return error.name === 'ChunkLoadError' ? 'critical' : 'error'
}

function logToStore(payload: any) {
  useFrameworkStore.getState().logEvent({
    type: 'error',
    payload
  })
}
