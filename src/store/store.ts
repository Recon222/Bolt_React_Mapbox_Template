// Add to FrameworkState
interface FrameworkState {
  // ...existing state...
  logs: LogEntry[]
}

interface FrameworkActions {
  // ...existing actions...
  addLog: (entry: LogEntry) => void
  clearLogs: () => void
}

// Add to store implementation
addLog: (entry) => set((state) => ({
  logs: [...state.logs.slice(-100), entry]
})),

clearLogs: () => set({ logs: [] }),
