type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: object
}

class Logger {
  private static instance: Logger
  private store = useFrameworkStore

  private constructor() {}

  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  log(level: LogLevel, message: string, context?: object) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    }
    
    this.store.getState().addLog(entry)
    
    if (import.meta.env.DEV) {
      const consoleMethod = level === 'debug' ? 'debug' : level
      console[consoleMethod](`[${level}] ${message}`, context)
    }
  }

  debug(message: string, context?: object) {
    this.log('debug', message, context)
  }

  info(message: string, context?: object) {
    this.log('info', message, context)
  }

  warn(message: string, context?: object) {
    this.log('warn', message, context)
  }

  error(message: string, context?: object) {
    this.log('error', message, context)
  }
}

export const logger = Logger.getInstance()
