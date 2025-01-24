import { Component, ErrorInfo, ReactNode } from 'react'
import { captureError } from '@/lib/telemetry'
import { ErrorFallback } from './ErrorFallback'

interface ErrorBoundaryProps {
  children: ReactNode
  context?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureError(error, {
      type: 'component',
      context: this.props.context,
      stack: info.componentStack
    })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }
    return this.props.children
  }
}
