import { useEffect } from 'react'
import { logger } from '@/lib/logging'

export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (!import.meta.env.DEV) return

    const metrics = {
      fps: 0,
      memory: 0,
      renderTime: 0
    }

    const checkFPS = () => {
      let frameCount = 0
      let lastTime = Date.now()
      
      const tick = () => {
        frameCount++
        const now = Date.now()
        if (now - lastTime >= 1000) {
          metrics.fps = frameCount
          frameCount = 0
          lastTime = now
        }
        requestAnimationFrame(tick)
      }
      tick()
    }

    const logMetrics = () => {
      const mem = performance.memory
      logger.debug('Performance Metrics', {
        fps: metrics.fps,
        jsHeapSize: mem?.usedJSHeapSize,
        renderTime: metrics.renderTime
      })
    }

    checkFPS()
    const interval = setInterval(logMetrics, 5000)
    return () => clearInterval(interval)
  }, [])
}
