import { useFrameworkStore } from '@/store/store'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export const DebugPanel = () => {
  const logs = useFrameworkStore((s) => s.logs)
  const clearLogs = useFrameworkStore((s) => s.clearLogs)
  const [open, setOpen] = useState(import.meta.env.DEV)

  if (!import.meta.env.DEV) return null

  return (
    <div className={cn(
      'fixed bottom-4 right-4 bg-map-overlay p-4 rounded-lg shadow-map-control',
      'w-[400px] max-h-[60vh] overflow-hidden flex flex-col'
    )}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">Debug Panel</h3>
        <div className="flex gap-2">
          <Button size="sm" onClick={clearLogs}>Clear</Button>
          <Button size="sm" onClick={() => setOpen(!open)}>
            {open ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>
      
      {open && (
        <div className="flex-1 overflow-auto text-xs font-mono space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="p-2 bg-white rounded">
              <div className="text-map-secondary">{log.timestamp}</div>
              <pre className="whitespace-pre-wrap">{log.message}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
